# Gene2Function

A proof of concept for integrating human disease data and orthology.

## Prerequisites

* [Docker](https://www.docker.com/products/overview)
* [Docker Compose](https://docs.docker.com/compose/install/)

## Installation

### Clone the github repository

```
    git clone https://github.com/FlyBase/gene2function.git
```

### Run docker-compose

```
    cd gene2function
    docker-compose up -d
```

## Post Installation

### Data

Once the containers are running you need to populate it with data.
The command below will execute a script to fetch all required data
and store it in the `/data` directory.


```
    docker-compose exec g2f /g2f/bin/fetch_g2f_data.sh
```

Next you need to load it into the database.

```
    docker-compose exec g2f perl /g2f/bin/load_DO.pl
    docker-compose exec g2f perl /g2f/bin/load_gene_info.pl
```

Now fire up your browser and head over to http://localhost:5000/.


## Development environment

### Required Tools

#### Web application development 

* NodeJS (v4.5+) - https://nodejs.org/en/

#### Compile JS application

1. Install JS dependencies.
   ```
   cd gene2function/src/js
   npm install
   ```

2. Modify PATH  
   For BASH shells
   ```
   export PATH=./node_modules/.bin:$PATH
   ```
   Place in your .bash_profile to persist this change.

3. Run webpack
   ```
   cd gene2function/src/js
   webpack
   ```
   or for continuous building on file changes
   ```
   webpack -w 
   ```
