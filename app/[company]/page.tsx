import { PageProps } from "@/lib/util";
import { Button } from "@/ui/Button";
import { IconButton } from "@/ui/IconButton";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

export default async function CompanyPage({}: PageProps) {
  return (
    <div className="p-8 flex flex-col gap-4 flex-1">
      <h1 className="text-2xl text-center font-bold">Components</h1>

      <div className="flex gap-2">
        <IconButton icon={faRocket} size="xs" />
        <IconButton icon={faRocket} size="sm" />
        <IconButton icon={faRocket} />
        <IconButton icon={faRocket} size="lg" />
        <IconButton icon={faRocket} size="xl" />
      </div>
      <div className="flex gap-2">
        <IconButton variant="light" color="danger" icon={faRocket} />
        <IconButton variant="filled" color="danger" icon={faRocket} />
        <IconButton variant="outline" color="danger" icon={faRocket} />
      </div>
      <div className="flex gap-2">
        <IconButton variant="light" color="success" icon={faRocket} />
        <IconButton variant="filled" color="success" icon={faRocket} />
        <IconButton variant="outline" color="success" icon={faRocket} />
      </div>
      <div className="flex gap-2">
        <IconButton variant="light" color="primary" icon={faRocket} />
        <IconButton variant="filled" color="primary" icon={faRocket} />
        <IconButton variant="outline" color="primary" icon={faRocket} />
      </div>
      <div className="flex gap-2">
        <IconButton variant="light" color="accent" icon={faRocket} />
        <IconButton variant="filled" color="accent" icon={faRocket} />
        <IconButton variant="outline" color="accent" icon={faRocket} />
      </div>
      <div className="flex gap-2">
        <IconButton variant="light" color="neutral" icon={faRocket} />
        <IconButton variant="filled" color="neutral" icon={faRocket} />
        <IconButton variant="outline" color="neutral" icon={faRocket} />
      </div>

      <div className="flex gap-2">
        <Button iconLeft={faRocket} size="xs">
          Button XS
        </Button>
        <Button iconLeft={faRocket} size="sm">
          Button SM
        </Button>
        <Button iconLeft={faRocket} size="md">
          Button MD
        </Button>
        <Button iconLeft={faRocket} size="lg">
          Button LG
        </Button>
        <Button iconLeft={faRocket} size="xl">
          Button XL
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="light" color="danger" iconLeft={faRocket}>
          Button
        </Button>
        <Button variant="filled" color="danger" iconLeft={faRocket}>
          Button
        </Button>
        <Button variant="outline" color="danger" iconLeft={faRocket}>
          Button
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="light" color="success" iconLeft={faRocket}>
          Button
        </Button>
        <Button variant="filled" color="success" iconLeft={faRocket}>
          Button
        </Button>
        <Button variant="outline" color="success" iconLeft={faRocket}>
          Button
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="light" color="primary" iconLeft={faRocket}>
          Button
        </Button>
        <Button variant="filled" color="primary" iconLeft={faRocket}>
          Button
        </Button>
        <Button variant="outline" color="primary" iconLeft={faRocket}>
          Button
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="light" color="accent" iconLeft={faRocket}>
          Button
        </Button>
        <Button variant="filled" color="accent" iconLeft={faRocket}>
          Button
        </Button>
        <Button variant="outline" color="accent" iconLeft={faRocket}>
          Button
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="light" color="neutral" iconLeft={faRocket}>
          Button
        </Button>
        <Button variant="filled" color="neutral" iconLeft={faRocket}>
          Button
        </Button>
        <Button variant="outline" color="neutral" iconLeft={faRocket}>
          Button
        </Button>
      </div>
    </div>
  );
}

export const dynamic = "force-static",
  dynamicParams = true,
  revalidate = 300;
