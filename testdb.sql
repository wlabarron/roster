-- MySQL dump 10.17  Distrib 10.3.25-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: roster_test
-- ------------------------------------------------------
-- Server version	10.3.25-MariaDB-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `images` (
  `id` bigint(20) unsigned NOT NULL DEFAULT uuid_short(),
  `url` text NOT NULL,
  `alt` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (99066300793356293,'https://via.placeholder.com/750.png','Andrew smiles at the camera, with headphones around his neck.'),(99066300793356294,'https://via.placeholder.com/1200x750.png','The sun rises over the mountains'),(99066300793356295,'https://via.placeholder.com/750.png','Speedy Taxis');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `people`
--

DROP TABLE IF EXISTS `people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `people` (
  `id` bigint(20) unsigned NOT NULL DEFAULT uuid_short(),
  `nick` text NOT NULL,
  `name` text NOT NULL,
  `description` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `profileImage` bigint(20) unsigned DEFAULT NULL,
  `coverImage` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `people_coverImage` (`coverImage`),
  KEY `people_profileImage` (`profileImage`),
  CONSTRAINT `people_coverImage` FOREIGN KEY (`coverImage`) REFERENCES `images` (`id`),
  CONSTRAINT `people_profileImage` FOREIGN KEY (`profileImage`) REFERENCES `images` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `people`
--

LOCK TABLES `people` WRITE;
/*!40000 ALTER TABLE `people` DISABLE KEYS */;
INSERT INTO `people` VALUES (99066300793356288,'ab','Andrew Barron','Andrew\'s been on the airwaves since he was 13, and somehow we still let him have a show!',NULL,99066300793356293,99066300793356294),(99066300793356289,'wogan','Terry Wogan','Terry graced the airwaves from 1956 til 2016, and his name lives on in Wogan House, one of the BBC\'s buildings in London. ','wogan@bbc.co.uk',NULL,NULL);
/*!40000 ALTER TABLE `people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rel_shows_people`
--

DROP TABLE IF EXISTS `rel_shows_people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rel_shows_people` (
  `id` bigint(20) unsigned NOT NULL DEFAULT uuid_short(),
  `show` bigint(20) unsigned NOT NULL,
  `person` bigint(20) unsigned NOT NULL,
  `role` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rel_shows_people_person` (`person`),
  KEY `rel_shows_people_shows` (`show`),
  CONSTRAINT `rel_shows_people_person` FOREIGN KEY (`person`) REFERENCES `people` (`id`),
  CONSTRAINT `rel_shows_people_shows` FOREIGN KEY (`show`) REFERENCES `shows` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rel_shows_people`
--

LOCK TABLES `rel_shows_people` WRITE;
/*!40000 ALTER TABLE `rel_shows_people` DISABLE KEYS */;
INSERT INTO `rel_shows_people` VALUES (99066300793356296,99066300793356290,99066300793356288,'Presenter'),(99066300793356297,99066300793356291,99066300793356289,'Presenter'),(99078014494572544,99066300793356291,99066300793356288,'Producer');
/*!40000 ALTER TABLE `rel_shows_people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rel_shows_sponsors`
--

DROP TABLE IF EXISTS `rel_shows_sponsors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rel_shows_sponsors` (
  `id` bigint(20) unsigned NOT NULL DEFAULT uuid_short(),
  `show` bigint(20) unsigned NOT NULL,
  `sponsor` bigint(20) unsigned NOT NULL,
  `detail` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rel_shows_sponsors_show` (`show`),
  KEY `rel_shows_sponsors_sponsor` (`sponsor`),
  CONSTRAINT `rel_shows_sponsors_show` FOREIGN KEY (`show`) REFERENCES `shows` (`id`),
  CONSTRAINT `rel_shows_sponsors_sponsor` FOREIGN KEY (`sponsor`) REFERENCES `sponsors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rel_shows_sponsors`
--

LOCK TABLES `rel_shows_sponsors` WRITE;
/*!40000 ALTER TABLE `rel_shows_sponsors` DISABLE KEYS */;
INSERT INTO `rel_shows_sponsors` VALUES (99066300793356298,99066300793356290,99066300793356292,'Sponsors Song from a Soundtrack');
/*!40000 ALTER TABLE `rel_shows_sponsors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rel_urls`
--

DROP TABLE IF EXISTS `rel_urls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rel_urls` (
  `id` bigint(20) unsigned NOT NULL DEFAULT uuid_short(),
  `url` bigint(20) unsigned NOT NULL,
  `show` bigint(20) unsigned DEFAULT NULL,
  `sponsor` bigint(20) unsigned DEFAULT NULL,
  `people` bigint(20) unsigned DEFAULT NULL,
  `primary` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `rel_urls_people` (`people`),
  KEY `rel_urls_shows` (`show`),
  KEY `rel_urls_sponsors` (`sponsor`),
  KEY `rel_urls_url` (`url`),
  CONSTRAINT `rel_urls_people` FOREIGN KEY (`people`) REFERENCES `people` (`id`),
  CONSTRAINT `rel_urls_shows` FOREIGN KEY (`show`) REFERENCES `shows` (`id`),
  CONSTRAINT `rel_urls_sponsors` FOREIGN KEY (`sponsor`) REFERENCES `sponsors` (`id`),
  CONSTRAINT `rel_urls_url` FOREIGN KEY (`url`) REFERENCES `urls` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rel_urls`
--

LOCK TABLES `rel_urls` WRITE;
/*!40000 ALTER TABLE `rel_urls` DISABLE KEYS */;
INSERT INTO `rel_urls` VALUES (99075283969114115,99075283969114114,NULL,99066300793356292,NULL,1),(99075283969114117,99075283969114116,NULL,99066300793356292,NULL,0),(99076705234190337,99076705234190336,NULL,NULL,99066300793356289,1);
/*!40000 ALTER TABLE `rel_urls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shows`
--

DROP TABLE IF EXISTS `shows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shows` (
  `id` bigint(20) unsigned NOT NULL DEFAULT uuid_short(),
  `nick` text NOT NULL,
  `name` text NOT NULL,
  `tagline` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `profileImage` bigint(20) unsigned DEFAULT NULL,
  `coverImage` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `shows_coverImage` (`coverImage`),
  KEY `shows_profileImage` (`profileImage`),
  CONSTRAINT `shows_coverImage` FOREIGN KEY (`coverImage`) REFERENCES `images` (`id`),
  CONSTRAINT `shows_profileImage` FOREIGN KEY (`profileImage`) REFERENCES `images` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shows`
--

LOCK TABLES `shows` WRITE;
/*!40000 ALTER TABLE `shows` DISABLE KEYS */;
INSERT INTO `shows` VALUES (99066300793356290,'satbreak','Saturday Breakfast','Wake up to the weekend with a great mix of music.','Since 2015, Andrew has been starting your weekend off with a great mix of feel-good music, from the latest chart-topping tunes to the golden oldies you love.',NULL,99066300793356293,99066300793356294),(99066300793356291,'weekend','Weekend Wogan','Join Sir Terry Wogan for live music and musings every Sunday morning.','Weekend Wogan was originally broadcast in front of a studio audience, but moved to a studio after the first year.','weekendwogan@bbc.co.uk',NULL,NULL);
/*!40000 ALTER TABLE `shows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sponsors`
--

DROP TABLE IF EXISTS `sponsors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sponsors` (
  `id` bigint(20) unsigned NOT NULL DEFAULT uuid_short(),
  `nick` text NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `email` text DEFAULT NULL,
  `profileImage` bigint(20) unsigned DEFAULT NULL,
  `coverImage` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sponsors_coverImage` (`coverImage`),
  KEY `sponsors_profileImage` (`profileImage`),
  CONSTRAINT `sponsors_coverImage` FOREIGN KEY (`coverImage`) REFERENCES `images` (`id`),
  CONSTRAINT `sponsors_profileImage` FOREIGN KEY (`profileImage`) REFERENCES `images` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sponsors`
--

LOCK TABLES `sponsors` WRITE;
/*!40000 ALTER TABLE `sponsors` DISABLE KEYS */;
INSERT INTO `sponsors` VALUES (99066300793356292,'taxi','Speedy Taxis','Get where you\'re going safely and quickly with Speedy Taxis - mention This Radio Station for 10% off!','book@example.com',99066300793356295,NULL);
/*!40000 ALTER TABLE `sponsors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `times`
--

DROP TABLE IF EXISTS `times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `times` (
  `id` bigint(20) unsigned NOT NULL DEFAULT uuid_short(),
  `show` bigint(20) unsigned NOT NULL,
  `new_show` tinyint(1) NOT NULL DEFAULT 1,
  `start_time` time NOT NULL,
  `duration` int(11) NOT NULL,
  `recurrence_type` text DEFAULT NULL,
  `recurrence_period` text DEFAULT NULL,
  `recurrence_start` date DEFAULT NULL,
  `recurrence_end` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `times_shows` (`show`),
  CONSTRAINT `times_shows` FOREIGN KEY (`show`) REFERENCES `shows` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `times`
--

LOCK TABLES `times` WRITE;
/*!40000 ALTER TABLE `times` DISABLE KEYS */;
INSERT INTO `times` VALUES (99082466496610304,99066300793356290,1,'09:00:00',5400,'once',NULL,'2021-01-06','2021-01-06'),(99091148018024450,99066300793356290,0,'12:00:00',7200,'once',NULL,'2021-01-14','2021-01-14'),(99091148018024451,99066300793356290,1,'16:00:00',3600,'once',NULL,'2020-12-23','2020-12-23'),(99091148018024452,99066300793356290,0,'08:00:00',7200,'every','7','2021-01-04','2021-01-18'),(99091148018024453,99066300793356290,1,'12:00:00',5400,'every','14','2020-12-31','2021-02-14'),(99091148018024454,99066300793356290,0,'18:00:00',3600,'every','7','2021-01-13','2021-02-03'),(99091148018024455,99066300793356290,1,'20:00:00',7200,'from-start','6,2','2020-12-01','2021-01-31'),(99091148018024456,99066300793356290,0,'20:00:00',5400,'from-start','2,4','2021-01-01','2021-06-30'),(99091148018024457,99066300793356290,1,'20:00:00',3600,'from-start','1,1','1990-01-01','1990-01-01'),(99091148018024458,99066300793356290,0,'22:00:00',7200,'from-end','5,1','2020-12-01','2021-01-31'),(99091148018024459,99066300793356290,1,'22:00:00',5400,'from-end','2,3','2021-01-01','2021-06-30'),(99091148018024460,99066300793356290,0,'22:00:00',3600,'from-end','3,2','1990-01-01','1990-01-01');
/*!40000 ALTER TABLE `times` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `urls`
--

DROP TABLE IF EXISTS `urls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `urls` (
  `id` bigint(20) unsigned NOT NULL DEFAULT uuid_short(),
  `name` text NOT NULL,
  `url` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `urls`
--

LOCK TABLES `urls` WRITE;
/*!40000 ALTER TABLE `urls` DISABLE KEYS */;
INSERT INTO `urls` VALUES (99075283969114114,'Facebook','https://www.facebook.com/speedytaxis'),(99075283969114116,'Twitter','https://twitter.com/speedytaxis'),(99076705234190336,'BBC','https://www.bbc.co.uk');
/*!40000 ALTER TABLE `urls` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-04 21:14:34
