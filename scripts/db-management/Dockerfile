FROM 'ubuntu'

RUN apt update
RUN apt -y upgrade
RUN apt -y install wget
RUN apt -y install lsb-release

RUN wget -qO /etc/apt/trusted.gpg.d/pgdg.asc https://www.postgresql.org/media/keys/ACCC4CF8.asc
RUN echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -sc)-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list
RUN apt update
RUN apt install -y postgresql-client-14