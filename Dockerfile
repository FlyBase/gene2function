FROM debian:jessie
MAINTAINER Josh Goodman <jogoodma@indiana.edu>

RUN apt-get update && apt-get install -y \
        curl \
        perl \
        perl-doc \
        libdancer2-perl \
        libjson-perl \
        libbio-perl-perl \
        cpanminus \
        make \
        gcc \
        gzip

RUN cpanm Search::Elasticsearch

RUN mkdir -p /g2f
RUN mkdir -p /data

COPY . /g2f/

#Generate the HGNC mapping file.
RUN /g2f/bin/fetch_hgnc.pl | gzip > /data/hgnc_mapping_file.tsv.gz
#NCBI gene_info file for gene symbols and synonyms.
RUN curl -s ftp://ftp.ncbi.nlm.nih.gov/gene/DATA/gene_info.gz > /data/gene_info.gz
#DO OBO file
RUN curl -s -L http://purl.obolibrary.org/obo/doid.obo | gzip > /data/doid.obo.gz

VOLUME /g2f
VOLUME /data

EXPOSE 5000
ENTRYPOINT ["plackup"]

CMD ["-r","/g2f/bin/app.psgi"]
