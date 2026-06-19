--
-- PostgreSQL database dump
--

\restrict mVndVF2VRO6ZWtPSn9IGsQqQEdhX8zdemJeJSbLneldFVm532KKdIGhrJ0bw9ET

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: deadline_task; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deadline_task (
    is_overdue boolean,
    id character varying(255) NOT NULL
);


--
-- Name: group_task; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_task (
    id character varying(255) NOT NULL,
    assigned_to_id character varying(255)
);


--
-- Name: group_task_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_task_members (
    group_task_id character varying(255) NOT NULL,
    members character varying(255),
    user_id character varying(255) NOT NULL
);


--
-- Name: histories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.histories (
    history_at timestamp(6) with time zone NOT NULL,
    action character varying(255) NOT NULL,
    history_by_user_id character varying(255),
    id character varying(255) NOT NULL,
    management_task_id character varying(255),
    task_id character varying(255)
);


--
-- Name: labels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.labels (
    id character varying(255) NOT NULL,
    nama character varying(255) NOT NULL,
    warna character varying(255) NOT NULL
);


--
-- Name: management_tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.management_tasks (
    id character varying(255) NOT NULL,
    nama character varying(255)
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    is_read boolean NOT NULL,
    id character varying(255) NOT NULL,
    pesan text NOT NULL,
    task_id character varying(255),
    user_id character varying(255)
);


--
-- Name: personal_task; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personal_task (
    id character varying(255) NOT NULL,
    owner character varying(255),
    owner_id character varying(255)
);


--
-- Name: task_labels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.task_labels (
    label_id character varying(255) NOT NULL,
    task_id character varying(255) NOT NULL
);


--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    deadline date,
    created_at timestamp(6) with time zone,
    deskripsi text,
    id character varying(255) NOT NULL,
    judul character varying(255) NOT NULL,
    management_task_id character varying(255),
    prioritas character varying(255),
    status character varying(255),
    task_type character varying(255),
    owner_id character varying(255)
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    email character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    nama character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255)
);


--
-- Data for Name: deadline_task; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.deadline_task (is_overdue, id) FROM stdin;
\.


--
-- Data for Name: group_task; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.group_task (id, assigned_to_id) FROM stdin;
0a7612ae-050a-4acd-9cd4-2046579484cb	\N
e533c836-cd47-4f07-8bac-8b45654d8f6d	738d8a1b-1ecc-4131-969a-ba8cb84886c6
03bd2461-d668-4bd7-b58d-bde4e9ac488b	\N
de039305-56d2-42e9-a83c-f77d24dd5253	02ccf5d8-7962-4840-a193-126172714d08
ea5806bb-f931-4d65-ac2c-473b16db068b	\N
b6849e57-c24d-49bc-bac4-b68bef19d31f	\N
53f99f0d-3a49-49c3-97be-4908f11268b6	\N
0b342cda-cbf1-46b6-b856-ab239c2c9cb2	02ccf5d8-7962-4840-a193-126172714d08
a150df4a-1ddc-453a-af01-e29e2aac8c57	\N
\.


--
-- Data for Name: group_task_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.group_task_members (group_task_id, members, user_id) FROM stdin;
e533c836-cd47-4f07-8bac-8b45654d8f6d	\N	738d8a1b-1ecc-4131-969a-ba8cb84886c6
0a7612ae-050a-4acd-9cd4-2046579484cb	\N	738d8a1b-1ecc-4131-969a-ba8cb84886c6
03bd2461-d668-4bd7-b58d-bde4e9ac488b	\N	02ccf5d8-7962-4840-a193-126172714d08
de039305-56d2-42e9-a83c-f77d24dd5253	\N	738d8a1b-1ecc-4131-969a-ba8cb84886c6
0b342cda-cbf1-46b6-b856-ab239c2c9cb2	\N	738d8a1b-1ecc-4131-969a-ba8cb84886c6
\.


--
-- Data for Name: histories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.histories (history_at, action, history_by_user_id, id, management_task_id, task_id) FROM stdin;
2026-06-15 20:19:13.708546+00	Task dibuat	\N	b6ef4747-fe04-40f8-ac11-fb01f6c92eb2	\N	952ebeec-c078-4416-b9d4-cf43b588bf79
2026-06-15 20:19:59.53515+00	Task dibuat	\N	dd0e830f-e644-4e2d-a50c-0acf9fc5c801	\N	162be042-7c5e-42aa-bdc8-6f9c7f754773
2026-06-15 20:20:51.697416+00	Status diubah dari TODO ke IN_PROGRESS	\N	47feb534-337a-4867-8a33-292eee38b751	\N	162be042-7c5e-42aa-bdc8-6f9c7f754773
2026-06-15 20:27:10.899364+00	Task dibuat	\N	c3f8a222-21d9-4c35-a9b1-46bfe60a3ec8	\N	eb116e26-86e8-45cc-aa9e-20987bc31cfc
2026-06-15 20:27:28.952586+00	Task dibuat	\N	6e1f802e-6b82-452d-83f6-1da4e4d46202	\N	ed9cd636-6835-4f91-8a34-819859ee044d
2026-06-15 21:22:40.204107+00	Task dibuat	\N	39bf1f51-c419-42b6-bc76-ca5920e07eab	\N	8862a0e4-1518-462d-b331-cc1d7b3735a1
2026-06-15 21:24:48.594222+00	Status diubah dari TODO ke IN_PROGRESS	\N	c7a02278-7e91-4ace-8164-646c35bd8430	\N	8862a0e4-1518-462d-b331-cc1d7b3735a1
2026-06-15 23:32:41.886838+00	Task melewati deadline	\N	ad495f29-8fe6-4ce4-9e5b-a3cf289cd337	\N	ed9cd636-6835-4f91-8a34-819859ee044d
2026-06-16 03:11:04.361945+00	Status diubah dari IN_PROGRESS ke REVIEW	\N	d323d9e0-620f-4cbc-9f60-6976e0e59764	\N	162be042-7c5e-42aa-bdc8-6f9c7f754773
2026-06-16 03:11:10.878857+00	Status diubah dari REVIEW ke IN_PROGRESS	\N	a0bca9cf-1cdd-4a58-a4b5-85e91175e080	\N	162be042-7c5e-42aa-bdc8-6f9c7f754773
2026-06-16 03:11:13.189761+00	Status diubah dari IN_PROGRESS ke DONE	\N	cca959a2-42d0-4632-be1d-002366b0c549	\N	162be042-7c5e-42aa-bdc8-6f9c7f754773
2026-06-16 03:11:15.595698+00	Status diubah dari DONE ke REVIEW	\N	af534843-923f-4717-8da3-607ee3bbd182	\N	162be042-7c5e-42aa-bdc8-6f9c7f754773
2026-06-16 03:11:18.408776+00	Status diubah dari TODO ke DONE	\N	b22d8169-fd77-434b-91f5-aa0c41828ca8	\N	eb116e26-86e8-45cc-aa9e-20987bc31cfc
2026-06-16 03:38:56.725024+00	Task diperbarui	\N	cbc4324c-b67b-4ebb-9afe-ebb8339485e6	\N	ed9cd636-6835-4f91-8a34-819859ee044d
2026-06-16 03:39:08.808458+00	Task diperbarui	\N	b80e2ef4-2507-4d8e-bc2a-76dd5167e6db	\N	ed9cd636-6835-4f91-8a34-819859ee044d
2026-06-16 03:47:52.57129+00	Status diubah dari IN_PROGRESS ke REVIEW	\N	fc8bb159-83c6-479d-b996-23fc0a943932	\N	8862a0e4-1518-462d-b331-cc1d7b3735a1
2026-06-16 03:47:54.667957+00	Status diubah dari REVIEW ke IN_PROGRESS	\N	b586749f-3737-4a33-ab2e-f6cd8be3f608	\N	8862a0e4-1518-462d-b331-cc1d7b3735a1
2026-06-16 07:07:01.302286+00	Task dibuat	\N	0635aacd-d96f-4d90-b744-99772818343b	\N	4472af73-c8dc-437a-b0fb-ea904412112c
2026-06-16 07:33:30.319919+00	Status diubah dari TODO ke IN_PROGRESS	\N	2e8e8381-8a72-467a-bde4-79949cffd04b	\N	4472af73-c8dc-437a-b0fb-ea904412112c
2026-06-16 07:33:49.586811+00	Task diperbarui	\N	1f347379-8e1e-4e72-bfe8-ec3766224902	\N	4472af73-c8dc-437a-b0fb-ea904412112c
2026-06-16 07:43:23.03583+00	Status diubah dari IN_PROGRESS ke TODO	\N	ddfd1a6c-a833-4e09-9eaf-1cf2413527ca	\N	4472af73-c8dc-437a-b0fb-ea904412112c
2026-06-16 07:53:27.742751+00	Status diubah dari IN_PROGRESS ke TODO	\N	e4483a3d-70cb-4687-ad8d-c38ace67b7a6	\N	de039305-56d2-42e9-a83c-f77d24dd5253
2026-06-16 07:53:29.30915+00	Status diubah dari TODO ke IN_PROGRESS	\N	002b7c4b-f49b-42e6-9730-972c8d1105db	\N	de039305-56d2-42e9-a83c-f77d24dd5253
2026-06-16 07:53:31.242357+00	Status diubah dari IN_PROGRESS ke TODO	\N	fd550959-46ef-4d62-81d5-a0bf9012dad6	\N	de039305-56d2-42e9-a83c-f77d24dd5253
2026-06-16 11:21:31.040096+00	Task dibuat	\N	c3cff87e-e9f1-49cc-98dd-643c78efa848	\N	a3609283-d7be-494c-814f-57cd3a551f92
2026-06-16 11:21:38.858929+00	Task dibuat	\N	dab3d022-2c2f-42a8-add6-6374c1c535b5	\N	434689a9-6a7c-47c9-99df-022d415405db
2026-06-16 11:47:21.189757+00	Task dibuat	\N	ead0f0a6-b042-4aa6-a04e-f3f48059dc7c	\N	c99139df-5a37-47d1-9867-3a96d20f77e3
2026-06-16 11:47:24.61729+00	Status diubah dari TODO ke IN_PROGRESS	\N	7363565d-4ac1-48b7-b2ce-0a1b1be5d3ef	\N	c99139df-5a37-47d1-9867-3a96d20f77e3
2026-06-16 11:47:25.424869+00	Status diubah dari IN_PROGRESS ke REVIEW	\N	c2104fbd-4e83-42a0-81ec-d070e1780c98	\N	c99139df-5a37-47d1-9867-3a96d20f77e3
2026-06-16 11:47:26.662745+00	Status diubah dari REVIEW ke DONE	\N	0c6fe454-9a1f-40a5-bd12-6c13856142de	\N	c99139df-5a37-47d1-9867-3a96d20f77e3
2026-06-16 11:47:28.309573+00	Status diubah dari DONE ke IN_PROGRESS	\N	f63473b2-cf0f-48b2-9c87-3a44a5b0505b	\N	c99139df-5a37-47d1-9867-3a96d20f77e3
2026-06-16 11:47:29.31556+00	Status diubah dari IN_PROGRESS ke TODO	\N	83beb54b-c5eb-4ac7-a963-851ba4b17ec8	\N	c99139df-5a37-47d1-9867-3a96d20f77e3
2026-06-16 14:01:59.319109+00	Status diubah dari TODO ke DONE	\N	d7b2342d-e3af-49be-8bff-ed8ab4c94c43	\N	0b342cda-cbf1-46b6-b856-ab239c2c9cb2
2026-06-16 14:04:23.630605+00	Status diubah dari DONE ke TODO	\N	a31f40b4-152d-4428-a107-f44ab17282d5	\N	0b342cda-cbf1-46b6-b856-ab239c2c9cb2
2026-06-16 14:04:31.660562+00	Status diubah dari TODO ke IN_PROGRESS	\N	0b0bc1b4-8b95-4ca6-937f-f328464a800b	\N	0b342cda-cbf1-46b6-b856-ab239c2c9cb2
2026-06-16 14:04:37.135205+00	Status diubah dari TODO ke IN_PROGRESS	\N	2b421aad-1f66-43a5-8752-5f33ae40f4f1	\N	c99139df-5a37-47d1-9867-3a96d20f77e3
2026-06-16 14:22:58.721892+00	Task dibuat	\N	e4eb80da-1d84-4744-9084-efb218de59f2	\N	1f11319b-fa4f-4fc1-8ee3-f154e1ca33a9
2026-06-16 14:25:32.551869+00	Task dibuat	\N	902c66b9-f7b0-4216-8781-1af4df9a9796	\N	11e7d340-c7dd-46ef-8216-e90a168bbac9
2026-06-16 14:27:08.295044+00	Status diubah dari TODO ke REVIEW	\N	fe755255-4856-40df-9a34-2df8088d89cc	\N	11e7d340-c7dd-46ef-8216-e90a168bbac9
2026-06-16 14:27:09.775904+00	Status diubah dari REVIEW ke TODO	\N	2d9add15-f1c8-417d-a699-8a53c7ba3a33	\N	11e7d340-c7dd-46ef-8216-e90a168bbac9
2026-06-16 14:56:42.059595+00	Status diubah dari TODO ke IN_PROGRESS	\N	9cab878f-bc11-4642-9ea9-b84d70264ba4	\N	11e7d340-c7dd-46ef-8216-e90a168bbac9
2026-06-16 14:56:43.672078+00	Status diubah dari IN_PROGRESS ke TODO	\N	e8429e41-9ae8-4b62-8357-576add1a2878	\N	11e7d340-c7dd-46ef-8216-e90a168bbac9
2026-06-16 15:14:00.414909+00	Task dibuat	\N	4808a108-8069-40cd-8403-8fbfd959c91f	\N	51de9699-b50d-4000-9734-1dbf07f17f52
2026-06-16 15:14:23.125138+00	Status diubah dari TODO ke DONE	\N	6813bcef-196a-46d0-9df7-8aa89c255069	\N	51de9699-b50d-4000-9734-1dbf07f17f52
2026-06-16 15:42:50.528246+00	Status diubah dari DONE ke REVIEW	\N	554f45f5-c627-4b2b-ba41-7044ae55eeaf	\N	51de9699-b50d-4000-9734-1dbf07f17f52
2026-06-16 15:43:38.101017+00	Task dibuat	\N	03d5bcda-ca85-4612-b1a6-34c43c3529ef	\N	702afeb6-0713-4fb0-82e6-44faa1bc8e27
2026-06-16 15:43:42.023302+00	Status diubah dari TODO ke DONE	\N	b352c875-f869-43b2-aff4-f845ed89c1d3	\N	702afeb6-0713-4fb0-82e6-44faa1bc8e27
\.


--
-- Data for Name: labels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.labels (id, nama, warna) FROM stdin;
ffb1d756-48e3-4020-a8b5-1f7b48c520a0	PBO	#996633
6d444474-d0a5-4839-a64c-8c6b80034731	IMK	#338d99
2c3ce0e4-5969-4aaa-a787-63443d4fe73e	IMPAL	#70e172
\.


--
-- Data for Name: management_tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.management_tasks (id, nama) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (is_read, id, pesan, task_id, user_id) FROM stdin;
t	8eeafa6a-c59e-4f5e-90ad-e11ad6f4ebb6	Status task 'TUBES PBO' berubah menjadi IN_PROGRESS	11e7d340-c7dd-46ef-8216-e90a168bbac9	\N
t	6394bce3-9360-47e8-a860-91718d130288	Status task 'TUBES PBO' berubah menjadi TODO	11e7d340-c7dd-46ef-8216-e90a168bbac9	\N
f	fbb1c716-2b8e-462b-966d-4edcc9919c1b	Task baru dibuat: Tubes IMK	51de9699-b50d-4000-9734-1dbf07f17f52	\N
f	a3a7955e-9e21-49cc-b26c-e0d92b9e8f99	Status task 'Tubes IMK' berubah menjadi DONE	51de9699-b50d-4000-9734-1dbf07f17f52	\N
f	64c04b9d-ba42-4ca9-a0a4-49bccf3034f6	Status task 'Tubes IMK' berubah menjadi REVIEW	51de9699-b50d-4000-9734-1dbf07f17f52	01b0890b-6881-44c7-a194-7746f6ef61b5
f	450fc1d9-81e4-40c9-8e12-a946da4a4442	Task baru dibuat: TP Jarkom	702afeb6-0713-4fb0-82e6-44faa1bc8e27	01b0890b-6881-44c7-a194-7746f6ef61b5
f	f8c105aa-20b7-49e9-b884-079d5967dd86	Status task 'TP Jarkom' berubah menjadi DONE	702afeb6-0713-4fb0-82e6-44faa1bc8e27	01b0890b-6881-44c7-a194-7746f6ef61b5
t	51057948-0a63-42eb-ba22-4a6359252bea	Status task 'a' berubah menjadi IN_PROGRESS	c99139df-5a37-47d1-9867-3a96d20f77e3	\N
t	729c9bae-089c-48a9-9528-02a7e08e597a	Task baru dibuat: Tugas PBO	1f11319b-fa4f-4fc1-8ee3-f154e1ca33a9	\N
t	cf005f18-adeb-40e5-94a7-bad22c780a88	Status task 'a' berubah menjadi TODO	0b342cda-cbf1-46b6-b856-ab239c2c9cb2	\N
t	2d974fd8-d3f8-460a-97e6-4fc44909f086	Status task 'TUBES PBO' berubah menjadi REVIEW	11e7d340-c7dd-46ef-8216-e90a168bbac9	\N
t	c1bcf8c1-92fd-4fa7-b0ae-98ed9cd9fbce	Status task 'a' berubah menjadi IN_PROGRESS	0b342cda-cbf1-46b6-b856-ab239c2c9cb2	\N
t	2300dd1d-db4c-4a52-abd4-6c722b5f11ac	Task baru dibuat: TUBES PBO	11e7d340-c7dd-46ef-8216-e90a168bbac9	\N
t	4144d12d-ccec-42df-ae61-1dd05f66153f	Status task 'TUBES PBO' berubah menjadi TODO	11e7d340-c7dd-46ef-8216-e90a168bbac9	\N
\.


--
-- Data for Name: personal_task; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.personal_task (id, owner, owner_id) FROM stdin;
\.


--
-- Data for Name: task_labels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.task_labels (label_id, task_id) FROM stdin;
ffb1d756-48e3-4020-a8b5-1f7b48c520a0	ed9cd636-6835-4f91-8a34-819859ee044d
ffb1d756-48e3-4020-a8b5-1f7b48c520a0	4472af73-c8dc-437a-b0fb-ea904412112c
ffb1d756-48e3-4020-a8b5-1f7b48c520a0	1f11319b-fa4f-4fc1-8ee3-f154e1ca33a9
ffb1d756-48e3-4020-a8b5-1f7b48c520a0	11e7d340-c7dd-46ef-8216-e90a168bbac9
6d444474-d0a5-4839-a64c-8c6b80034731	51de9699-b50d-4000-9734-1dbf07f17f52
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tasks (deadline, created_at, deskripsi, id, judul, management_task_id, prioritas, status, task_type, owner_id) FROM stdin;
2026-06-20	2026-06-15 20:19:13.647216+00	Tes update status	952ebeec-c078-4416-b9d4-cf43b588bf79	Tes Status	\N	HIGH	TODO	TASK	\N
2026-06-20	2026-06-16 15:14:00.318699+00		51de9699-b50d-4000-9734-1dbf07f17f52	Tubes IMK	\N	HIGH	REVIEW	TASK	01b0890b-6881-44c7-a194-7746f6ef61b5
2026-06-15	2026-06-15 20:27:28.928051+00	Tes	ed9cd636-6835-4f91-8a34-819859ee044d	Priority Medium	\N	MEDIUM	TODO	TASK	\N
2026-06-22	2026-06-16 15:43:38.048723+00		702afeb6-0713-4fb0-82e6-44faa1bc8e27	TP Jarkom	\N	MEDIUM	DONE	TASK	01b0890b-6881-44c7-a194-7746f6ef61b5
2026-06-20	2026-06-15 20:19:59.510451+00	Tes update status	162be042-7c5e-42aa-bdc8-6f9c7f754773	Tes Status	\N	HIGH	REVIEW	TASK	\N
2026-06-25	2026-06-15 20:27:10.875544+00	Tes	eb116e26-86e8-45cc-aa9e-20987bc31cfc	Priority Low	\N	LOW	DONE	TASK	\N
2026-06-20	2026-06-15 21:22:40.109168+00	Cek notifikasi otomatis	8862a0e4-1518-462d-b331-cc1d7b3735a1	Tes Notification	\N	HIGH	IN_PROGRESS	TASK	\N
2026-06-20	\N	Tugas kelompok PBO	0a7612ae-050a-4acd-9cd4-2046579484cb	Project PlanWise	\N	HIGH	TODO	GROUP	\N
2026-06-20	\N	Tugas kelompok PBO	e533c836-cd47-4f07-8bac-8b45654d8f6d	Project PlanWise	\N	HIGH	TODO	GROUP	\N
2026-06-19	\N	anjeng susah bgt	03bd2461-d668-4bd7-b58d-bde4e9ac488b	Tubes IMK	\N	HIGH	TODO	GROUP	\N
2026-06-20	2026-06-16 07:07:01.222246+00	Testing ownership	4472af73-c8dc-437a-b0fb-ea904412112c	Task Rifki	\N	HIGH	TODO	TASK	02ccf5d8-7962-4840-a193-126172714d08
2026-06-18	\N	icikiwir	de039305-56d2-42e9-a83c-f77d24dd5253	project tembok ratapan garut	\N	HIGH	TODO	GROUP	02ccf5d8-7962-4840-a193-126172714d08
2026-06-16	2026-06-16 11:21:30.966731+00	a	a3609283-d7be-494c-814f-57cd3a551f92	a	\N	HIGH	TODO	TASK	02ccf5d8-7962-4840-a193-126172714d08
2026-06-16	2026-06-16 11:21:38.808087+00	a	434689a9-6a7c-47c9-99df-022d415405db	a	\N	LOW	TODO	TASK	02ccf5d8-7962-4840-a193-126172714d08
2026-06-16	\N	a	ea5806bb-f931-4d65-ac2c-473b16db068b	a	\N	MEDIUM	TODO	GROUP	02ccf5d8-7962-4840-a193-126172714d08
\N	\N	a	b6849e57-c24d-49bc-bac4-b68bef19d31f	a	\N	MEDIUM	TODO	GROUP	02ccf5d8-7962-4840-a193-126172714d08
2026-06-16	\N	a	53f99f0d-3a49-49c3-97be-4908f11268b6	a	\N	MEDIUM	TODO	GROUP	02ccf5d8-7962-4840-a193-126172714d08
2026-06-16	\N	a	0b342cda-cbf1-46b6-b856-ab239c2c9cb2	a	\N	MEDIUM	IN_PROGRESS	GROUP	a42138f2-4d23-4b79-a8eb-5d5c2758fb8f
2026-06-16	2026-06-16 11:47:21.122791+00	a	c99139df-5a37-47d1-9867-3a96d20f77e3	a	\N	LOW	IN_PROGRESS	TASK	a42138f2-4d23-4b79-a8eb-5d5c2758fb8f
2026-06-16	2026-06-16 14:22:58.586246+00		1f11319b-fa4f-4fc1-8ee3-f154e1ca33a9	Tugas PBO	\N	HIGH	TODO	TASK	02ccf5d8-7962-4840-a193-126172714d08
2026-06-16	\N	KITANI	a150df4a-1ddc-453a-af01-e29e2aac8c57	Tubes IMPAL	\N	MEDIUM	IN_PROGRESS	GROUP	01b0890b-6881-44c7-a194-7746f6ef61b5
2026-06-16	2026-06-16 14:25:32.459778+00		11e7d340-c7dd-46ef-8216-e90a168bbac9	TUBES PBO	\N	LOW	TODO	TASK	01b0890b-6881-44c7-a194-7746f6ef61b5
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (email, id, nama, password, role) FROM stdin;
hakim@gmail.com	738d8a1b-1ecc-4131-969a-ba8cb84886c6	Hakim	123456	USER
rifki@gmail.com	02ccf5d8-7962-4840-a193-126172714d08	Rifki	123456	ADMIN
ihsan@gmail.com	80cbf3cc-4347-4a3d-834e-67c1cc4c3b61	ihsan	ihsan123	ADMIN
a@gmail.com	a42138f2-4d23-4b79-a8eb-5d5c2758fb8f	a	123456	USER
ijib@gmail.com	e83fba4a-d45e-4249-9546-ea1846e09ee4	ijib	123456	USER
muhammadrifkiwidya@gmail.com	01b0890b-6881-44c7-a194-7746f6ef61b5	rifki	Rifkiwidya6*	\N
\.


--
-- Name: deadline_task deadline_task_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deadline_task
    ADD CONSTRAINT deadline_task_pkey PRIMARY KEY (id);


--
-- Name: group_task group_task_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_task
    ADD CONSTRAINT group_task_pkey PRIMARY KEY (id);


--
-- Name: histories histories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.histories
    ADD CONSTRAINT histories_pkey PRIMARY KEY (id);


--
-- Name: labels labels_nama_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_nama_key UNIQUE (nama);


--
-- Name: labels labels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_pkey PRIMARY KEY (id);


--
-- Name: management_tasks management_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.management_tasks
    ADD CONSTRAINT management_tasks_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: personal_task personal_task_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_task
    ADD CONSTRAINT personal_task_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: deadline_task fk17lo1kqrxhgpcfxcycp1u0gy6; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deadline_task
    ADD CONSTRAINT fk17lo1kqrxhgpcfxcycp1u0gy6 FOREIGN KEY (id) REFERENCES public.tasks(id);


--
-- Name: personal_task fk1h1a3te95mvve09vksfl4yyi8; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_task
    ADD CONSTRAINT fk1h1a3te95mvve09vksfl4yyi8 FOREIGN KEY (id) REFERENCES public.tasks(id);


--
-- Name: notifications fk2ktjq1slw0ldkuy5rx8fbte2p; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk2ktjq1slw0ldkuy5rx8fbte2p FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: histories fk4pxwh0g4kyfnmuka0v4nwnasf; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.histories
    ADD CONSTRAINT fk4pxwh0g4kyfnmuka0v4nwnasf FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: group_task_members fk4u9c23cgclesmkwa29s75bp3s; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_task_members
    ADD CONSTRAINT fk4u9c23cgclesmkwa29s75bp3s FOREIGN KEY (group_task_id) REFERENCES public.group_task(id);


--
-- Name: task_labels fk7wi3dfqb8gx9kiysuy980sbus; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_labels
    ADD CONSTRAINT fk7wi3dfqb8gx9kiysuy980sbus FOREIGN KEY (task_id) REFERENCES public.tasks(id);


--
-- Name: group_task_members fk8btpcqun9lglo835bdy2v3ong; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_task_members
    ADD CONSTRAINT fk8btpcqun9lglo835bdy2v3ong FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: group_task fk8oaik3yv4jcpibgpdkdk5tm1o; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_task
    ADD CONSTRAINT fk8oaik3yv4jcpibgpdkdk5tm1o FOREIGN KEY (id) REFERENCES public.tasks(id);


--
-- Name: notifications fk9y21adhxn0ayjhfocscqox7bh; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk9y21adhxn0ayjhfocscqox7bh FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tasks fkdiw9eo1rr7k5gsgth7cry0hy2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT fkdiw9eo1rr7k5gsgth7cry0hy2 FOREIGN KEY (management_task_id) REFERENCES public.management_tasks(id);


--
-- Name: histories fkf8t4yowcpeorm9g70q8kls1pf; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.histories
    ADD CONSTRAINT fkf8t4yowcpeorm9g70q8kls1pf FOREIGN KEY (management_task_id) REFERENCES public.management_tasks(id);


--
-- Name: personal_task fkg83hs3megwps23uat83vi9uml; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_task
    ADD CONSTRAINT fkg83hs3megwps23uat83vi9uml FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: group_task fkgjj6j2ftl6m8tint6614dekyi; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_task
    ADD CONSTRAINT fkgjj6j2ftl6m8tint6614dekyi FOREIGN KEY (assigned_to_id) REFERENCES public.users(id);


--
-- Name: tasks fkh279lo9lqbhxqh68jq9sqs83s; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT fkh279lo9lqbhxqh68jq9sqs83s FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- Name: histories fkjp8y2p6kciosibifxs12lbyl3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.histories
    ADD CONSTRAINT fkjp8y2p6kciosibifxs12lbyl3 FOREIGN KEY (history_by_user_id) REFERENCES public.users(id);


--
-- Name: task_labels fklr49cbsj797rym78wepiid0sh; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.task_labels
    ADD CONSTRAINT fklr49cbsj797rym78wepiid0sh FOREIGN KEY (label_id) REFERENCES public.labels(id);


--
-- PostgreSQL database dump complete
--

\unrestrict mVndVF2VRO6ZWtPSn9IGsQqQEdhX8zdemJeJSbLneldFVm532KKdIGhrJ0bw9ET

