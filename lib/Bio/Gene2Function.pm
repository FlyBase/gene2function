package Bio::Gene2Function;
use Dancer2;
use autodie;

our $VERSION = '0.1';

get '/' => sub {
    template 'index';
};

get '/search/organism/:org/gene/:term' => sub {
    template 'index';
};

get '/search/disease/:term' => sub {
    template 'index';
};

true;
