create table user (
  id                int(11) not null auto_increment,
  name              varchar(100) not null,  
  gender            enum('MALE', 'FEMALE') not null,
  username          varchar(100) not null,
  email             varchar(255) not null,
  facebook_account  varchar(255) default null,
  twitter_account   varchar(255) default null,
  google_account    varchar(255) default null,
  registration_date timestamp default current_timestamp,
  primary key (id),
  unique key `uq_user_username` (`username`),
  unique key `uq_user_email` (`email`),
  unique key `uq_user_facebook_account` (`facebook_account`),
  unique key `uq_user_twitter_account` (`twitter_account`),
  unique key `uq_user_google_account` (`google_account`)
) engine = innodb default charset = utf8;

create table state (
  id      int(11) not null auto_increment,
  name    varchar(100) not null,
  acronym varchar(20) not null,
  primary key (id)
) engine = innodb default charset = utf8;

create table political_party (
  id      int(11) not null auto_increment,
  name    varchar(100) not null,
  acronym varchar(20) not null,
  primary key (id),
  unique key `uq_politician_party_name` (`name`),
  unique key `uq_politician_party_acronym` (`acronym`)
) engine = innodb default charset = utf8;

create table political_organ (
  id   int(11) not null auto_increment,
  name varchar(100) not null,
  primary key (id),
  unique key `uq_politician_organ_name` (`name`)
) engine = innodb default charset = utf8;

create table political_office (
  id          int(11) not null auto_increment,
  title       varchar(100) not null,
  description varchar(255) not null,
  primary key (id),
  unique key `uq_politician_office_title` (`title`)
) engine = innodb default charset = utf8;

create table politician (
  id                    int(11) not null auto_increment,
  name                  varchar(100) not null,
  nickname              varchar(100) default null,
  biography             varchar(255) default null,
  photo_path            varchar(100) not null,
  email                 varchar(100) default null,
  slug                  varchar(100) not null,
  state_id              int(11) default null,
  political_party_id    int(11) not null,
  political_organ_id    int(11) default null,
  political_office_id   int(11) not null,
  registered_by_user_id int(11) not null,
  registration_date     timestamp default current_timestamp,
  primary key (id),
  unique key `uq_politician_slug` (`slug`),
  unique key `uq_politician_email` (`email`),
  key `fk_politician_registered_by_user` (`registered_by_user_id`),
  key `fk_politician_political_office` (`political_office_id`),  
  key `fk_politician_political_party` (`political_party_id`),
  key `fk_politician_political_organ` (`political_organ_id`),
  key `fk_politician_state` (`state_id`),
  constraint `fk_politician_registered_by_user` foreign key (`registered_by_user_id`) references `user` (`id`),
  constraint `fk_politician_political_office` foreign key (`political_office_id`) references `political_office` (`id`),
  constraint `fk_politician_political_party` foreign key (`political_party_id`) references `political_party` (`id`),
  constraint `fk_politician_political_organ` foreign key (`political_organ_id`) references `political_organ` (`id`),
  constraint `fk_politician_state` foreign key (`state_id`) references `state` (`id`)
) engine = innodb default charset = utf8;

create table politician_cover_photo (
  id            int(11) not null auto_increment,
  photo_path    varchar(100) not null,
  politician_id int(11) not null,
  primary key (id),
  key `fk_politician_cover_photo_politician` (`politician_id`),
  constraint `fk_politician_cover_photo_politician` foreign key (`politician_id`) references `politician` (`id`)
) engine = innodb default charset = utf8;

create table politician_user_vote (
  politician_id int(11) not null,
  user_id       int(11) not null,
  vote_type     enum('UP', 'DOWN') not null,
  vote_date     timestamp default current_timestamp,
  primary key (politician_id, user_id),
  key `fk_politician_user_vote_user` (`user_id`),
  key `fk_politician_user_vote_politician` (`politician_id`),
  constraint `fk_politician_user_vote_user` foreign key (`user_id`) references `user` (`id`),
  constraint `fk_politician_user_vote_politician` foreign key (`politician_id`) references `politician` (`id`)
) engine = innodb default charset = utf8;

create table promise_category (
  id   int(11) not null auto_increment,
  name varchar(100) not null,
  slug varchar(100) not null,
  primary key (id),
  unique key `uq_promise_category_slug` (`slug`)
) engine = innodb default charset = utf8;

create table promise (
  id                      int(11) not null auto_increment,
  title                   text not null,
  description             text default null,
  slug                    varchar(255) not null,
  evidence_date           date default null,
  state                   enum('NON_STARTED', 'STARTED', 'FULFILLED', 'PARTIALLY_FULFILLED', 'DISCARDED') not null,
  category_id             int(11) not null,
  politician_id           int(11) not null,
  registered_by_user_id   int(11) not null,
  last_edited_by_user_id  int(11) default null,
  registration_date       timestamp default current_timestamp,
  primary key (id),
  key `fk_promise_category` (`category_id`),
  key `fk_promise_politician` (`politician_id`),
  key `fk_promise_registered_by_user` (`registered_by_user_id`),
  key `fk_promise_last_edited_by_user` (`last_edited_by_user_id`),
  constraint `fk_promise_category` foreign key (`category_id`) references `promise_category` (`id`),
  constraint `fk_promise_politician` foreign key (`politician_id`) references `politician` (`id`),
  constraint `fk_promise_registered_by_user` foreign key (`registered_by_user_id`) references `user` (`id`),
  constraint `fk_promise_last_edited_by_user` foreign key (`last_edited_by_user_id`) references `user` (`id`)
) engine = innodb default charset = utf8;

create table promise_evidence (
  id                    int(11) not null auto_increment,
  title                 varchar(255) not null,
  description           varchar(255) not null,
  url                   varchar(255) not null,
  host                  varchar(255) not null,
  thumbnail             varchar(255) not null,
  promise_id            int(11) not null,
  registered_by_user_id int(11) not null,
  registration_date     timestamp default current_timestamp,
  primary key (id),
  key `fk_promise_evidence_promise` (`promise_id`),
  key `fk_promise_evidence_registered_by_user` (`registered_by_user_id`),
  constraint `fk_promise_evidence_promise` foreign key (`promise_id`) references `promise` (`id`),
  constraint `fk_promise_evidence_registered_by_user` foreign key (`registered_by_user_id`) references `user` (`id`)
) engine = innodb default charset = utf8;

create table promise_user_vote (
  promise_id        int(11) not null,
  user_id           int(11) not null,
  registration_date timestamp default current_timestamp,
  primary key (promise_id, user_id),
  key `fk_promise_user_vote_promise` (`promise_id`),
  key `fk_promise_user_vote_user` (`user_id`),
  constraint `fk_promise_user_vote_promise` foreign key (`promise_id`) references `promise` (`id`),
  constraint `fk_promise_user_vote_user` foreign key (`user_id`) references `user` (`id`)
) engine = innodb default charset = utf8;

create table promise_user_comment (
  promise_id        int(11) not null,
  user_id           int(11) not null,
  content           text not null,
  registration_date timestamp default current_timestamp null,
  primary key (promise_id, user_id),
  key `fk_promise_user_comment_promise` (`promise_id`),
  key `fk_promise_user_comment_user` (`user_id`),
  constraint `fk_promise_user_comment_promise` foreign key (`promise_id`) references `promise` (`id`),
  constraint `fk_promise_user_comment_user` foreign key (`user_id`) references `user` (`id`)
) engine = innodb default charset = utf8;