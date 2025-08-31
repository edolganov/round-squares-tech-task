BEGIN;


CREATE TABLE app_role (
    value TEXT NOT NULL PRIMARY KEY,
    info TEXT NOT NULL
);
        INSERT INTO app_role(value, info)
        VALUES
            ('admin', 'System admin'),
            ('survivor', 'Game player'),
            ('nikita', 'Banned user');



CREATE TABLE app_user (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    login VARCHAR(255) NOT NULL UNIQUE,
    psw_hash TEXT NOT NULL,
    psw_salt TEXT NOT NULL
);
        CREATE INDEX app_user__login__idx ON app_user (login);



CREATE TABLE app_user_role (
    user_id UUID NOT NULL references app_user(id)
        on update restrict
        on delete restrict,
    role_value TEXT NOT NULL references app_role(value)
        on update restrict
        on delete restrict
);



CREATE TABLE app_round (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    visible_at TIMESTAMPTZ NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    stat_winner TEXT, -- will be filled by server after round over
    stat_winner_score BIGINT, -- will be filled by server after round over
    stat_total_score BIGINT, -- will be filled by server after round over
    CHECK (visible_at <= start_at),
    CHECK (start_at < end_at)
);
        CREATE INDEX app_round__visible_at__idx ON app_round (visible_at);



CREATE TABLE app_user_tap_event (
    log_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    round_id UUID NOT NULL references app_round(id)
        on update restrict
        on delete restrict,
    user_id UUID NOT NULL references app_user(id)
        on update restrict
        on delete restrict
);
        CREATE INDEX app_user_tap_event__log_time__idx ON app_user_tap_event (log_time);

COMMIT;