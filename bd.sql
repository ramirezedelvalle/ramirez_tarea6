create table productos(
    producto_id serial not null,
    producto_nombre varchar(50) not null,
    producto_precio decimal(10,2) not null,
    producto_situacion smallint not null default 1,
    primary key (producto_id)
)

create table clientes(
    cliente_id serial not null,
    cliente_nombre varchar (60) not null,
    cliente_nit varchar (10) not null,
    cliente_situacion smallint not null default 1,
    primary key (cliente_id)
)