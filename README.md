# Gene2Function

A proof of concept for integrating human disease data and orthology.

## Installation

### Docker

Docker images are available if you would like to test out the
site locally.  Once Docker is installed you can 

Create the database container with a name of *g2f-db*.  You can change this
to something else if you want.

    > docker run -d --name g2f-db elasticsearch


Once the db container is up, start the Gene2Function container called *g2f*.
Again, you can name it whatever you would like.  If you changed the database
container name, be sure to use the changed name in the `--link` flag.


    > docker run -d --name g2f -P --link g2f-db:db flybase/gene2function

### Data


Once the container are running you need to populate it with data.
The command below will execute a script to fetch all required data
and store it in the `/data` directory.


    > docker exec -i -t g2f /g2f/bin/fetch_g2f_data.sh

Next you need to load it into the database.

    > docker exec -i -t g2f perl /g2f/bin/load_DO.pl
    > docker exec -i -t g2f perl /g2f/bin/load_gene_info.pl


Now fire up your browser and head over to http://localhost:5000/.

