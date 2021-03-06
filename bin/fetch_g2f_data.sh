#!/bin/bash

#Generate the HGNC mapping file.
echo "Fetching HGNC mapping file."
/g2f/bin/fetch_hgnc.pl | gzip > /data/hgnc_mapping.tsv.gz

#NCBI gene_info file for gene symbols and synonyms.
echo "Fetching NCBI gene_info"
curl -s ftp://ftp.ncbi.nlm.nih.gov/gene/DATA/gene_info.gz > /data/gene_info.gz

#DO OBO file
echo "Fetching DO.obo"
# The file available below has consistently had formatting issues that
# causes the BioPerl parser to fail.
# The issues were related to faults in the file versus BioPerl
#curl -s -L http://purl.obolibrary.org/obo/doid.obo | gzip > /data/doid.obo.gz
# Use this alternative URL for now.
curl -s -L https://github.com/DiseaseOntology/HumanDiseaseOntology/raw/master/src/ontology/doid.obo | gzip > /data/doid.obo.gz

#OMIM  mim2gene
echo "Fetching mim2gene"
curl -s http://omim.org/static/omim/data/mim2gene.txt | gzip > /data/mim2gene.txt.gz

#NCBI OMIM->Gene mapping file.
echo "Fetching NCBI OMIM->Gene mapping file"
curl -s ftp://ftp.ncbi.nlm.nih.gov/gene/DATA/mim2gene_medgen | gzip > /data/mim2gene_medgen.gz
