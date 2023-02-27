# monthly-mess-back

## About
This is my submission for Neighborhood Hacks 2.

This is a backend for [Monthly Mess](https://github.com/myankpraksh/monthly-mess). It provides all necessary APIs for its frontend.

## Requirement
* It requires a PostgreSQL database to work. The SQL code to create required database is

```sql

create table public.mess
(
	id serial
		primary key,
	name text not null,
	email text not null
		unique,
	phone text not null,
	short_description text not null,
	address text not null,
	pincode text not null,
	city text not null,
	password text not null,
	rating real default 3 not null,
	no_of_rating integer default 0,
	img_name text default 'food-placeholder.jpg'::text
);

```

## How to run it?

This repo is the backend, to run this you would need the [frontend](https://github.com/myankpraksh/monthly-mess)

In server.js update the database details. And either run this backend at localhost:3000 or update the backend address in frontend

### Step 1
Clone this repo
### Step 2
### Run `npm install`
### Step 3
### Run `npm start`
