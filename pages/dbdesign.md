---
layout: default
---

## Database Design

For the final project of my Database Design class we had to work in teams to design and implement a database in SQL and SQL*Plus. We went through a bunch of steps to robustly create our database, starting by choosing our scenario, a tutoring website. Then making an ER diagram, then converting that to Relation Structure form, then creating the tables in our database, then populating those tables, and finally outputting some reports.

[back](/)

* * *

<img src="/assets/img/dbmodel.jpg" width="100%" height="100%">

Our ERD

```design.sql

create table Member
(
	mem_id char(6),
	mem_name varchar2(24),
	is_student char(1) default 'N' check (is_student in ('Y', 'N')),
	is_tutor char(1) default 'N' check (is_tutor in ('Y', 'N')),
	primary key (mem_id)
);

create table Schedule
(
        schedule_id char(7),
        schedule_full char(1) default 'N' check (schedule_full in ('Y', 'N')),
        primary key (schedule_id)
);

create table Subject
(
        sub_id char(4),
        sub_name varchar2(24) not null,
        primary key (sub_id)
);

create table Student
(
	mem_id char(6),
	primary key (mem_id),
	foreign key (mem_id) references Member
);

create table Tutor
(
	mem_id char(6),
	tutor_desc varchar2(196) not null,
	offers_hw_help char(1) default 'N' check (offers_hw_help in ('Y', 'N')),
	schedule_id char(7) not null,
	primary key (mem_id),
	foreign key (mem_id) references Member,
	foreign key (schedule_id) references Schedule
);

create table Course
(
        course_id char(8),
        course_title varchar2(36) not null,
        course_start date not null,
        course_end date not null,
        course_price number default 0 check (course_price >= 0),
	tutor_id char(6) not null,
        sub_id char(4) not null,
        primary key (course_id),
        foreign key (tutor_id) references Tutor(mem_id),
        foreign key (sub_id) references Subject
);

create table Member_Comm
(
        mem_id char(6),
        mem_comm_method varchar2(35),
        primary key (mem_id, mem_comm_method),
        foreign key (mem_id) references Member
);

create table Time_Slot
(
        slot_id char(10),
        slot_begin date not null,
        slot_end date not null,
        slot_booked char(1) default 'N' check (slot_booked in ('Y', 'N')), 
        schedule_id char(7) not null,
        primary key (slot_id),
        foreign key (schedule_id) references Schedule
);

create table Enrollment
(
	stu_id char(6),
	course_id char(8),
	enroll_start date not null,
	enroll_end date,
	enroll_status varchar2(10) default 'ENROLLED' check (enroll_status in ('ENROLLED', 'COMPLETED', 'CANCELED')),
	primary key (stu_id, course_id),
	foreign key (stu_id) references Student(mem_id),
	foreign key (course_id) references Course
);

create table Payment
(
	stu_id char(6),
	course_id char(8),
	payment_date date not null,
	payment_amount decimal(6, 2) default 0.99 check (payment_amount > 0),
	card_number char(16) not null,
	primary key (stu_id, course_id),
	foreign key (stu_id) references Student(mem_id),
	foreign key (course_id) references Course 
);

create table Tutor_Langs
(
        tutor_id char(6),
        language varchar2(16),
        primary key (tutor_id, language),
        foreign key (tutor_id) references Tutor(mem_id)
);

create table Tutor_Resource
(
	res_id char(5),
	res_title varchar2(60),
	res_link varchar2(100) not null,
	res_upload_date date not null,
	tutor_id char(6) not null,
	primary key (res_id),
	foreign key (tutor_id) references Tutor(mem_id)
);

create table Rating
(
        stu_id char(6),
        tutor_id char(6),
        rating_num number default 5 check (rating_num between 1 and 5),
        rating_text varchar2(128),
        primary key (stu_id, tutor_id),
        foreign key (stu_id) references Student(mem_id),
        foreign key (tutor_id) references Tutor(mem_id)
);

```