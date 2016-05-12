package Bio::Gene2Function;

use Dancer2;
use autodie;

use Search::Elasticsearch;
use LWP;

our $VERSION = '0.1';

my $es;
my $ua;

BEGIN {
    $es = Search::Elasticsearch->new( nodes => 'db:9200');
    $ua = LWP::UserAgent->new;
};

my %organisms = map { $_->{id} => $_ } @{load_organisms()};

get '/' => sub {
    template 'index';
};

get '/search/:term' => sub {
    template 'index';
};

get '/search/gene/:taxid/symbol/:symbol' => sub {
    template 'index';
};

get '/api/search/:term' => sub {
    my $term = params->{term};
    debug("Searching for " . $term);
    my $results = $es->search(
        index => ['gene','ontology'],
        type  => ['symbol','do'],
        size => 1000,
        body  => {
            query => {
                multi_match => {
                    query => $term,
                    type => 'phrase_prefix',
                    fields => ['id^10','name^7','symbol^7','fullname','symbol_synonyms^3','synonyms','dbxrefs','genes']
                }
            }
        }
    ); 

    content_type 'application/json';
    return to_json $results;
};


get '/ortholog/:taxid/:gene' => sub {
    template 'index';
};

get '/api/ortholog/:taxid/:gene' => sub {
    my $taxid = params->{taxid};
    my $gene  = params->{gene};

    my $response= $ua->get("http://flybase.org/cgi-bin/orthosearch.cgi?ortholog=" . $gene . "&orthologinput=" . get_species_abbrev($taxid) . "&format=json");

    if ($response->is_success) {
        content_type 'application/json';
        return $response->content;
    }
    else {
        status 500;
        return "Failed to fetch orthologs";
    }
};

sub get_species_abbrev {
    my $taxid = shift;
    my $org = $organisms{$taxid};
    return uc(substr $org->{genus}, 0, 1) . lc(substr $org->{species}, 0, 3);

}

sub load_organisms {
    local $/;
    open( my $fh, '<', File::Spec->catfile($FindBin::Bin,'..','conf','organisms.json'));
    my $json_text = <$fh>;
    close($fh);
    return from_json( $json_text );
}


true;
