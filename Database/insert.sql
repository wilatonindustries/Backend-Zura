--Table: configurations
INSERT INTO configurations (type, value, createdAt, updatedAt)  VALUES ('convinence_fee', 1, NOW(), NOW());
INSERT INTO configurations (type, value, createdAt, updatedAt)  VALUES ('gst', 18, NOW(), NOW());
INSERT INTO configurations (type, value, createdAt, updatedAt)  VALUES ('distance', 10, NOW(), NOW());

--Table: timing_banners
INSERT INTO timing_banners (timing, image, createdAt, updatedAt)  VALUES ('07:00AM-10:00AM', null, NOW(), NOW());
INSERT INTO timing_banners (timing, image, createdAt, updatedAt)  VALUES ('10:00AM-12:00PM', null, NOW(), NOW());
INSERT INTO timing_banners (timing, image, createdAt, updatedAt)  VALUES ('12:00PM-03:00PM', null, NOW(), NOW());
INSERT INTO timing_banners (timing, image, createdAt, updatedAt)  VALUES ('03:00PM-07:00PM', null, NOW(), NOW());
INSERT INTO timing_banners (timing, image, createdAt, updatedAt)  VALUES ('07:00PM-10:00PM', null, NOW(), NOW());
INSERT INTO timing_banners (timing, image, createdAt, updatedAt)  VALUES ('10:00PM-12:00AM', null, NOW(), NOW());

--Table: static_components
INSERT INTO static_components (about_us, terms_of_service, privacy_policy, faq, createdAt, updatedAt)
 VALUES ('value_for_about_us', 'value_for_terms_of_service', 'value_for_privacy_policy', 'value_for_faq', NOW(), NOW());

--Table: social_medias
INSERT INTO social_medias (title, description, status, link, createdAt, updatedAt)
 VALUES ('Instagram', 'description for instagram', true, 'instagram.com', NOW(), NOW());
INSERT INTO social_medias (title, description, status, link, createdAt, updatedAt)
 VALUES ('Linkdin', 'description for linkdin', false, 'linkdin.com', NOW(), NOW());