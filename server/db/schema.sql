-- schema.sql
BEGIN;

CREATE TABLE IF NOT EXISTS public.organization
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    owner_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT organizations_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.organization_user
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role character varying(20) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT organization_users_pkey PRIMARY KEY (id),
    CONSTRAINT organization_users_unique UNIQUE (organization_id, user_id),
    CONSTRAINT unique_org_user UNIQUE (organization_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.payment
(
    id character varying(50) COLLATE pg_catalog."default" NOT NULL,
    payment_date timestamp with time zone,
    payment numeric(10, 2),
    employee_id uuid,
    CONSTRAINT payment_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.project
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    project_manager_id uuid,
    start_date timestamp with time zone,
    estimated_hours integer,
    CONSTRAINT project_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.schema_migrations
(
    version bigint NOT NULL,
    dirty boolean NOT NULL,
    CONSTRAINT schema_migrations_pkey PRIMARY KEY (version)
);

CREATE TABLE IF NOT EXISTS public.time_record
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    timesheet_id integer NOT NULL,
    date timestamp with time zone NOT NULL,
    day character varying(50) COLLATE pg_catalog."default" NOT NULL,
    start_time character varying(50) COLLATE pg_catalog."default",
    end_time character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT time_record_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.timesheet
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    project_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    start_date_of_the_week character varying(10) COLLATE pg_catalog."default" NOT NULL,
    submission_date timestamp with time zone DEFAULT now(),
    approved boolean DEFAULT false,
    approved_by uuid,
    approved_date timestamp with time zone,
    CONSTRAINT timesheet_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."user"
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    first_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT employee_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.project_worker
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL,
    worker_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT project_worker_pkey PRIMARY KEY (id),
    CONSTRAINT organization_users_unique UNIQUE (project_id, user_id)
);

-- Foreign key constraints
ALTER TABLE IF EXISTS public.organization
    ADD CONSTRAINT organizations_owner_id_fkey FOREIGN KEY (owner_id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.organization_user
    ADD CONSTRAINT organization_users_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.payment
    ADD CONSTRAINT payment_employee_id_fkey FOREIGN KEY (employee_id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.project
    ADD CONSTRAINT project_project_manager_id_fkey FOREIGN KEY (project_manager_id)
    REFERENCES public."user" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.time_record
    ADD CONSTRAINT time_record_timesheet_id_fkey FOREIGN KEY (timesheet_id)
    REFERENCES public.timesheet (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.timesheet
    ADD CONSTRAINT timesheet_project_id_fkey FOREIGN KEY (project_id)
    REFERENCES public.project (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

ALTER TABLE IF EXISTS public.project_worker
    ADD CONSTRAINT project_worker_project_id_fkey FOREIGN KEY (project_id)
    REFERENCES public.project (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
    
ALTER TABLE IF EXISTS public.project_worker
    ADD CONSTRAINT project_worker_worker_id_fkey FOREIGN KEY (worker_id)
    REFERENCES public.user (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
END;
