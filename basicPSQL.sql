create table rawdata (
stop_id int
,on_street varchar(100)
,cross_street varchar(100)
,route varchar(10)
,boardings numeric
,alightings numeric
,month_beginning date
,daytype char(20)
,latitude numeric
,longitude numeric
);

copy rawdata from '/Users/mozilla/Desktop/CodeChallenges/Civis/cleaned_OctoBus.csv' with (format csv)


copy (with a as (
select
distinct on (route)
route
, count(stop_id) over (partition by route) as "tot_stops"
, sum(boardings) over (partition by route) as "tot_boardings"
, sum(alightings) over (partition by route) as "tot_alightings"
from rawdata
)
select *
from a
order by "tot_stops"
desc ) to '/Users/mozilla/Desktop/CodeChallenges/Civis/Agg_stops_board_alight.csv' with CSV header;

copy (
select latitude,longitude
from rawdata
) to
'/Users/mozilla/Desktop/CodeChallenges/Civis/bus_stops_lat_long.csv'
with CSV;

## Which stop appears on the most routes
with a as (
select
distinct on (stop_id)
stop_id
, count(route) over (partition by stop_id) as "tot_routes"
, sum(boardings) over (partition by stop_id) as "tot_stop_boardings"
, sum(alightings) over (partition by stop_id) as "tot_stop_alightings"
from rawdata )
select *
from a
order by "tot_routes"
desc
;


with a as (
select
distinct on (route)
route
, sum(alightings) as sum_alght
, count(alightings) as cnt_alght
from rawdata
group by 
route
)
select * 
from a
order by sum_alght
desc
;


with a as (
select max(alightings) as max_alght
,max(boardings) as max_brd
from rawdata
)
select stop_id,
route,cross_street,on_street,
boardings
,alightings
, alightings/boardings as "alght_brd_ratio"
from a,rawdata
where route = '151'
and boardings > a.max_brd/10
and alightings > a.max_alght/10
order by
alightings/boardings
desc
;

