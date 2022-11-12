import argparse
import os
from datetime import datetime
from json import loads
from subprocess import run
from sys import argv
from time import sleep

DOCKER_IMAGE_TAG = "zentask2-db-management"
DOCKER_ACTIONS = {"sync", "backup", "restore"}


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=[
                        *DOCKER_ACTIONS, *[f"vm-{a}" for a in DOCKER_ACTIONS], "docker-build", "it", "prisma"])
    parser.add_argument("-f", "--file", help="File to use for restore")
    parser.add_argument(
        "-v", "--variant", choices=["dev", "prod"], help="Db variant to use dev | prod")
    parser.add_argument(
        "-t", "--target", choices=["dev", "prod"], help="Target")
    return parser.parse_known_args()


def run_action_in_docker(action, args):
    args = vars(args)
    args_to_copy = ['file', 'variant', 'target']
    str_args = ""
    for arg in args_to_copy:
        if args[arg] is not None:
            str_args += f" --{arg} {args[arg]}"

    cmd = f"docker run --rm -it -v $(pwd)/scripts/db-management:/app --net=host -w=/app  {DOCKER_IMAGE_TAG} /usr/bin/python3 main.py vm-{action} {str_args}"
    run(cmd, shell=True)


def get_docker_cmd():
    cmd = f"docker run --rm -it -v $(pwd)/scripts/db-management:/app --net=host -w=/app  {DOCKER_IMAGE_TAG} /bin/bash"
    return cmd


def prisma(args, anyargs):
    target = args.target
    creds = loads(open("./scripts/db-management/db-credentials.json").read())
    if target is None:
        print("Error: No target specified. Please use '-t dev' or '-t prod' to specify the target to run the prisma commands in")
        return
    url = connection_url(creds[target])
    prismacmd = " ".join(anyargs)
    print(f"=> [{target.upper()}] yarn prisma {prismacmd}")
    cmd = f"DATABASE_URL='{url}' yarn prisma {prismacmd}"
    run(cmd, shell=True)

def connection_url(c):
    return f"postgresql://{c['user']}:{c['password']}@{c['host']}:{c['port']}/{c['database']}"


def docker_build():
    run(f"docker build -t {DOCKER_IMAGE_TAG} ./scripts/db-management", shell=True)
    print("Built docker image to tag: " + DOCKER_IMAGE_TAG)


def backup_database(variant):
    assert variant in ["dev", "prod"]
    creds = loads(open("db-credentials.json").read())[variant]
    if creds is None:
        print("No credentials found for " + variant)
        print("Check you have a db-credentials.json file in the same folder as the main script")
        return
    pw = creds['password']
    user = creds['user']
    db = creds['database']
    host = creds['host']
    port = creds['port']
    filename = f"backups/{variant}_{datetime.today().strftime('%Y-%m-%d_%H-%M-%S')}.dump"
    cmd = f"PGPASSWORD={pw} pg_dump -U {user} -h {host} -p {port} -d {db} -f ./{filename} -F c"
    run(cmd, shell=True)
    print(f"Successfully backed up {variant} database to: " + filename)
    return filename


def get_latest_backup(variant):
    files = [x for x in os.listdir(
        "./backups") if x.startswith(variant) and x.endswith(".dump")]
    sorted(files)
    return f"backups/{files[-1]}"


def restore_from_backup(filename, variant, from_variant="prod"):
    if filename is None:
        print("No filename provided")
        filename = get_latest_backup(from_variant)
        print("Automatically using latest backup: " + filename)
    if variant == "prod":
        print("Cannot restore to prod")
        return
    creds = loads(open("db-credentials.json").read())[variant]
    if creds is None:
        print("No credentials found for prod")
        print("Check you have a db-credentials.json file in the same folder as the main script")
        return
    pw = creds['password']
    user = creds['user']
    db = creds['database']
    host = creds['host']
    port = creds['port']

    from_db_name = loads(open("db-credentials.json").read()
                         )[from_variant]['database']

    # Drop existing database first
    cmd = f"PGPASSWORD={pw} psql -h {host} -U {user} -p {port} -c 'DROP DATABASE {db};'"
    run(cmd, shell=True)

    sleep(0.5)

    # Restore db
    cmd = f"PGPASSWORD={pw} pg_restore -h {host} -U {user} -p {port} -O -C -d postgres < {filename}"
    run(cmd, shell=True)

    sleep(0.5)

    # Rename db
    if from_db_name != db:
        cmd = f"PGPASSWORD={pw} psql -h {host} -U {user} -p {port} -c 'ALTER DATABASE {from_db_name} RENAME TO {db};'"
        run(cmd, shell=True)

    print(
        f"Potentially restored {filename} to {db} database. Check above for errors lol")


def sync_prod_db_to_local():
    filename = backup_database('prod')
    restore_from_backup(filename, 'dev', "prod")
    print("Done!: ", filename)


def handle_vm_action(action, args):
    if action == "sync":
        sync_prod_db_to_local()
    elif action == "backup":
        backup_database(args.variant if args.variant is not None else "prod")
    elif action == "restore":
        target = args.target if args.target is not None else "dev"
        src = "dev" if target == "prod" else "prod"
        restore_from_backup(args.file, target, src)
    else:
        print("Unknown docker action: " + action)


def main():
    args, anyargs = parse_args()
    action = args.action

    if action[:3] == "vm-":
        handle_vm_action(action[3:], args)
    else:
        if action in DOCKER_ACTIONS:
            run_action_in_docker(action, args)
        elif action == "docker-build":
            docker_build()
        elif action == "it":
            cmd = get_docker_cmd()
            os.system(cmd)
        elif action == "prisma":
            prisma(args, anyargs)
        else:
            print("Unknown action: " + action)


if __name__ == "__main__":
    main()
