CREATE TABLE IF NOT EXISTS public.admin (
        id SERIAL NOT NULL,
        email text ,    
        password text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.User (
        id SERIAL NOT NULL,
        username text,
        email   text,
        phone text NOT NULL,
        country_code text ,
        image   text ,
        cover_image text ,
        deviceToken text,
        status text,
        type text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.otp (
        id SERIAL,
        email text,
        otp text,
        status text,
        type text,
        oldPassword text,
        newPassword text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));


CREATE TABLE IF NOT EXISTS public.socialmedia (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        facebook text,
        twitter text,
        insta text,
        linkedin text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.Screens (
        id SERIAL,
        name text NOT NULL,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id)) ;

CREATE TABLE IF NOT EXISTS public.ads (
        id SERIAL NOT NULL,
        image text,
        link text,
        screen_id SERIAL NOT NULL,
        active_status text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));


CREATE TABLE IF NOT EXISTS public.categories (
        id SERIAL,
        name text NOT NULL,
        image text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));


CREATE TABLE IF NOT EXISTS public.items (
        id SERIAL NOT NULL,
        userid SERIAL NOT NULL,
        images TEXT[],
        name text,
        price text,
        category_id text,
        description text,
        location text,
        promoted text,
        start_date timestamp,
        end_date timestamp,
        added_by text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.saveitems (
        id SERIAL,
        item_ID SERIAL NOT NULL,
        user_ID SERIAL NOT NULL,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.shareitems (
        id SERIAL,
        item_id SERIAL NOT NULL,
        user_id SERIAL NOT NULL,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.rateusers (
        id SERIAL,
        rate_by_user_id SERIAL NOT NULL,
        user_id SERIAL NOT NULL,
        rating text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.merchandise (
        id SERIAL NOT NULL,
        adminID SERIAL NOT NULL,
        images TEXT[],
        name text,
        price text,
        category_id text,
        description text,
        location text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.followusers (
        id SERIAL,
        follow_by_user_id SERIAL NOT NULL,
        user_id SERIAL NOT NULL,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id)); 


CREATE TABLE IF NOT EXISTS public.notifications (
        id SERIAL,
        user_id SERIAL NOT NULL,
        notification_from SERIAL NOT NULL,
        notification_message text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.locations (
        id SERIAL,
        location_name text,
        user_id SERIAL NOT NULL,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));


CREATE TABLE IF NOT EXISTS public.dailydeals (
        id SERIAL NOT NULL,
        image TEXT,
        description text,
        title text,
        ends_at timestamp,
        status text,
        createdat timestamp NOT NULL,
        updatedat timestamp ,
        PRIMARY KEY (id));


CREATE TABLE IF NOT EXISTS public.orders (
        id SERIAL NOT NULL,
        user_id SERIAL NOT NULL,
        merchandise_id SERIAL NOT NULL,
		ordered_at text,
        status text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.logos (
        id SERIAL NOT NULL,
        image text,
        link text,
        screen_id SERIAL NOT NULL,
        active_status text,
        createdAt timestamp NOT NULL,
        updatedAt timestamp ,
        PRIMARY KEY (id))

-- CREATE TABLE IF NOT EXISTS public.SubscriptionPlan (
--         id SERIAL NOT NULL,
--         name text,
--         price text ,
--         no_Img_to_pdf_conversion text,
--         no_pdf_to_word_conversion text,
--         no_word_to_pdf_conversion text ,
--         freeTrail text,
--         freeTrailDays text,
--         duratin_days text,
--         createdAt timestamp,
--         updatedAt timestamp ,
--         PRIMARY KEY (id));


-- CREATE TABLE IF NOT EXISTS public.UsersSubscriptions (
        -- id SERIAL NOT NULL,
        -- userID SERIAL NOT NULL,
        -- name text ,
        -- email text,
        -- subscriptionID SERIAL NOT NULL ,
        -- createdAt timestamp,
        -- updatedAt timestamp ,
        -- PRIMARY KEY (id)); 
        