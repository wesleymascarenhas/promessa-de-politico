-- MySQL dump 10.13  Distrib 5.5.37, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: promessa_de_politico
-- ------------------------------------------------------
-- Server version	5.5.37-0ubuntu0.12.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `political_office`
--

DROP TABLE IF EXISTS `political_office`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `political_office` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_political_office_title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `political_office`
--

LOCK TABLES `political_office` WRITE;
/*!40000 ALTER TABLE `political_office` DISABLE KEYS */;
INSERT INTO `political_office` VALUES (1,'Presidente',''),(2,'Senador',''),(3,'Deputado',''),(4,'Governador',''),(5,'Prefeito',''),(6,'Vereador','');
/*!40000 ALTER TABLE `political_office` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `political_organ`
--

DROP TABLE IF EXISTS `political_organ`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `political_organ` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_political_organ_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `political_organ`
--

LOCK TABLES `political_organ` WRITE;
/*!40000 ALTER TABLE `political_organ` DISABLE KEYS */;
/*!40000 ALTER TABLE `political_organ` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `political_party`
--

DROP TABLE IF EXISTS `political_party`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `political_party` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `acronym` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_political_party_name` (`name`),
  UNIQUE KEY `uq_political_party_acronym` (`acronym`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `political_party`
--

LOCK TABLES `political_party` WRITE;
/*!40000 ALTER TABLE `political_party` DISABLE KEYS */;
INSERT INTO `political_party` VALUES (1,'Partido do Movimento Democrático Brasileiro','PMDB'),(2,'Partido Trabalhista','PTB'),(3,'Partido Democrático Trabalhista','PDT'),(4,'Partido dos Trabalhadores','PT'),(5,'Democratas','DEM'),(6,'Partido Comunista do Brasil','PCdoB'),(7,'Partido Socialista Brasileiro','PSB'),(8,'Partido da Social Democracia Brasileira','PSDB'),(9,'Partido Trabalhista Cristão','PTC'),(10,'Partido Social Cristão','PSC'),(11,'Partido da Mobilização Nacional','PMN'),(12,'Partido Republicano Progressista','PRP'),(13,'Partido Popular Socialista','PPS'),(14,'Partido Verde','PV'),(15,'Partido Trabalhista do Brasil','PTdoB'),(16,'Partido Progressista','PP'),(17,'Partido Socialista dos Trabalhadores Unificado','PSTU'),(18,'Partido Comunista Brasileiro','PCB'),(19,'Partido Renovador Trabalhista Brasileiro','PRTB'),(20,'Partido Humanista da Solidariedade','PHS'),(21,'Partido Social Democrata Cristão','PSDC'),(22,'Partido da Causa Operária','PCO'),(23,'Partido Trabalhista Nacional','PTN'),(24,'Partido Social Liberal','PSL'),(25,'Partido Republicano Brasileiro','PRB'),(26,'Partido Socialismo e Liberdade','PSOL'),(27,'Partido da República','PR'),(28,'Partido Social Democrático','PSD'),(29,'Partido Pátria Livre','PPL'),(30,'Partido Ecológico Nacional','PEN'),(31,'Partido Republicano da Ordem Social','PROS'),(32,'Solidariedade','SD');
/*!40000 ALTER TABLE `political_party` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `politician`
--

DROP TABLE IF EXISTS `politician`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `politician` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `nickname` varchar(100) DEFAULT NULL,
  `biography` varchar(255) DEFAULT NULL,
  `photo_filename` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `slug` varchar(100) NOT NULL,
  `state_id` int(11) DEFAULT NULL,
  `political_party_id` int(11) NOT NULL,
  `political_organ_id` int(11) DEFAULT NULL,
  `political_office_id` int(11) NOT NULL,
  `registered_by_user_id` int(11) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_politician_slug` (`slug`),
  UNIQUE KEY `uq_politician_email` (`email`),
  KEY `fk_politician_registered_by_user` (`registered_by_user_id`),
  KEY `fk_politician_political_office` (`political_office_id`),
  KEY `fk_politician_political_party` (`political_party_id`),
  KEY `fk_politician_political_organ` (`political_organ_id`),
  KEY `fk_politician_state` (`state_id`),
  CONSTRAINT `fk_politician_political_office` FOREIGN KEY (`political_office_id`) REFERENCES `political_office` (`id`),
  CONSTRAINT `fk_politician_political_organ` FOREIGN KEY (`political_organ_id`) REFERENCES `political_organ` (`id`),
  CONSTRAINT `fk_politician_political_party` FOREIGN KEY (`political_party_id`) REFERENCES `political_party` (`id`),
  CONSTRAINT `fk_politician_registered_by_user` FOREIGN KEY (`registered_by_user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_politician_state` FOREIGN KEY (`state_id`) REFERENCES `state` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `politician`
--

LOCK TABLES `politician` WRITE;
/*!40000 ALTER TABLE `politician` DISABLE KEYS */;
INSERT INTO `politician` VALUES (1,'Dilma Rousseff',NULL,'Economista e política brasileira, filiada ao Partido dos Trabalhadores (PT), e a atual presidente da República Federativa do Brasil.','1_1402265466487.jpg',NULL,'dilma-rousseff',NULL,4,NULL,1,1,'2014-06-09 00:51:27'),(2,'Teotônio Vilela Filho',NULL,NULL,'2_1402264799206.jpg',NULL,'teotonio-vilela-filho',27,8,NULL,4,1,'2014-06-09 00:51:28'),(3,'Camilo Capiberibe',NULL,NULL,'3_1402264834569.jpg',NULL,'camilo-capiberibe',16,7,NULL,4,1,'2014-06-09 00:51:28'),(4,'Omar Aziz',NULL,NULL,'4_1402264858949.jpg',NULL,'omar-aziz',13,11,NULL,4,1,'2014-06-09 00:51:28'),(5,'Jaques Wagner',NULL,NULL,'5_1402264885023.jpg',NULL,'jaques-wagner',29,4,NULL,4,1,'2014-06-09 00:51:28'),(6,'Cid Gomes',NULL,NULL,'6_1402264914445.jpg',NULL,'cid-gomes',23,7,NULL,4,1,'2014-06-09 00:51:28'),(7,'Renato Casagrande',NULL,NULL,'7_1402264945581.jpg',NULL,'renato-casagrande',32,7,NULL,4,1,'2014-06-09 00:51:28'),(8,'Marconi Perillo',NULL,NULL,'8_1402264962552.jpg',NULL,'marconi-perillo',52,8,NULL,4,1,'2014-06-09 00:51:28'),(9,'Roseana Sarney',NULL,NULL,'9_1402264981201.jpg',NULL,'roseana-sarney',21,1,NULL,4,1,'2014-06-09 00:51:28'),(10,'Silval Barbosa',NULL,NULL,'10_1402264998846.jpg',NULL,'silval-barbosa',51,1,NULL,4,1,'2014-06-09 00:51:28'),(11,'André Puccinelli',NULL,NULL,'11_1402265027880.jpg',NULL,'andre-puccinelli',50,1,NULL,4,1,'2014-06-09 00:51:28'),(12,'Antônio Anastasia',NULL,NULL,'12_1402265044370.jpg',NULL,'antonio-anastasia',31,8,NULL,4,1,'2014-06-09 00:51:28'),(13,'Simão Jatene',NULL,NULL,'13_1402265069972.jpg',NULL,'simao-jatene',15,8,NULL,4,1,'2014-06-09 00:51:28'),(14,'Ricardo Coutinho',NULL,NULL,'14_1402265084960.jpg',NULL,'ricardo-coutinho',25,7,NULL,4,1,'2014-06-09 00:51:28'),(15,'Beto Richa',NULL,NULL,'15_1402265124042.jpg',NULL,'beto-richa',41,8,NULL,4,1,'2014-06-09 00:51:28'),(16,'Eduardo Campos',NULL,NULL,'16_1402265140531.jpg',NULL,'eduardo-campos',26,7,NULL,4,1,'2014-06-09 00:51:28'),(17,'Wilson Martins',NULL,NULL,'17_1402265172262.jpg',NULL,'wilson-martins',22,7,NULL,4,1,'2014-06-09 00:51:28'),(18,'Sérgio Cabral Filho',NULL,NULL,'18_1402265190595.jpg',NULL,'sergio-cabral-filho',33,1,NULL,4,1,'2014-06-09 00:51:28'),(19,'Rosalba Ciarlini',NULL,NULL,'19_1402265205284.jpg',NULL,'rosalba-ciarlini',24,5,NULL,4,1,'2014-06-09 00:51:28'),(20,'Tarso Genro',NULL,NULL,'20_1402265219875.jpg',NULL,'tarso-genro',43,4,NULL,4,1,'2014-06-09 00:51:28'),(21,'Raimundo Colombo',NULL,NULL,'21_1402265234634.jpg',NULL,'raimundo-colombo',42,28,NULL,4,1,'2014-06-09 00:51:28'),(22,'Geraldo Alckmin',NULL,NULL,'22_1402265251827.jpg',NULL,'geraldo-alckmin',35,8,NULL,4,1,'2014-06-09 00:51:28'),(23,'Marcelo Déda',NULL,NULL,'23_1402265264193.jpg',NULL,'marcelo-deda',28,4,NULL,4,1,'2014-06-09 00:51:29'),(24,'Siqueira Campos',NULL,NULL,'24_1402265279171.jpg',NULL,'siqueira-campos',17,8,NULL,4,1,'2014-06-09 00:51:29'),(25,'Fernando Haddad',NULL,NULL,'25_1402359788839.jpg',NULL,'fernando-haddad',35,4,NULL,5,1,'2014-06-09 04:56:47'),(26,'Eduardo Paes',NULL,NULL,'26_1402359878146.jpg',NULL,'eduardo-paes',33,1,NULL,5,1,'2014-06-09 07:56:47'),(27,'Antonio Carlos Magalhães Neto',NULL,NULL,'27_1402359896039.jpg',NULL,'antonio-carlos-magalhaes-neto',29,5,NULL,5,1,'2014-06-09 04:56:47'),(28,'Roberto Cláudio',NULL,NULL,'28_1402359973137.jpg',NULL,'roberto-claudio',23,7,NULL,5,1,'2014-06-09 04:56:47'),(29,'Márcio Lacerda',NULL,NULL,'29_1402360021997.jpg',NULL,'marcio-lacerda',31,7,NULL,5,1,'2014-06-09 04:56:47'),(30,'Arthur Virgílio Neto',NULL,NULL,'30_1402360130111.jpg',NULL,'arthur-virgilio-neto',13,8,NULL,5,1,'2014-06-09 07:56:47'),(31,'Gustavo Fruet',NULL,NULL,'31_1402360152141.jpg',NULL,'gustavo-fruet',41,3,NULL,5,1,'2014-06-09 04:56:47'),(32,'Geraldo Júlio',NULL,NULL,'32_1402360177567.jpg',NULL,'geraldo-julio',26,7,NULL,5,1,'2014-06-09 04:56:47'),(33,'José Fortunati',NULL,NULL,'33_1402360214115.jpg',NULL,'jose-fortunati',43,3,NULL,5,1,'2014-06-09 04:56:47'),(34,'Zenaldo Coutinho',NULL,NULL,'34_1402360250499.jpg',NULL,'zenaldo-coutinho',15,8,NULL,5,1,'2014-06-09 04:56:47'),(35,'Sebastião Almeida',NULL,NULL,'35_1402360279389.jpg',NULL,'sebastiao-almeida',35,4,NULL,5,1,'2014-06-09 04:56:47'),(36,'Paulo Garcia',NULL,NULL,'36_1402360354967.jpg',NULL,'paulo-garcia',52,4,NULL,5,1,'2014-06-09 07:56:48'),(37,'Jonas Donizette',NULL,NULL,'37_1402360374741.jpg',NULL,'jonas-donizette',35,7,NULL,5,1,'2014-06-09 04:56:48'),(38,'Edivaldo Holanda Junior',NULL,NULL,'38_1402360403623.jpg',NULL,'edivaldo-holanda-junior',21,9,NULL,5,1,'2014-06-09 04:56:48'),(39,'Neílton Mulim',NULL,NULL,'39_1402360427669.jpg',NULL,'neilton-mulim',33,27,NULL,5,1,'2014-06-09 04:56:48'),(40,'Rui Palmeira',NULL,NULL,'40_1402360498994.jpg',NULL,'rui-palmeira',27,8,NULL,5,1,'2014-06-09 04:56:48'),(41,'Alexandre Cardoso',NULL,NULL,'41_1402360523565.jpg',NULL,'alexandre-cardoso',33,7,NULL,5,1,'2014-06-09 04:56:48'),(42,'Nelson Bornier',NULL,NULL,'42_1402360549736.jpg',NULL,'nelson-bornier',33,1,NULL,5,1,'2014-06-09 04:56:48'),(43,'Firmino Filho',NULL,NULL,'43_1402360578729.jpg',NULL,'firmino-filho',22,8,NULL,5,1,'2014-06-09 04:56:48'),(44,'Luís Marinho',NULL,NULL,'44_1402360596856.jpg',NULL,'luis-marinho',35,4,NULL,5,1,'2014-06-09 04:56:48'),(45,'Carlos Eduardo Alves',NULL,NULL,'45_1402360621014.jpg',NULL,'carlos-eduardo-alves',24,3,NULL,5,1,'2014-06-09 04:56:48'),(46,'Alcides Bernal',NULL,NULL,'46_1402360643480.jpg',NULL,'alcides-bernal',50,16,NULL,5,1,'2014-06-09 04:56:48'),(47,'Jorge Lapas',NULL,NULL,'47_1402360662242.jpg',NULL,'jorge-lapas',35,4,NULL,5,1,'2014-06-09 04:56:48'),(48,'Carlos Grana',NULL,NULL,'48_1402360678961.jpg',NULL,'carlos-grana',35,4,NULL,5,1,'2014-06-09 04:56:48'),(49,'Luciano Cartaxo',NULL,NULL,'49_1402360710388.jpg',NULL,'luciano-cartaxo',25,4,NULL,5,1,'2014-06-09 04:56:48'),(50,'Carlinhos Almeida',NULL,NULL,'50_1402360804459.jpg',NULL,'carlinhos-almeida',35,4,NULL,5,1,'2014-06-09 07:56:48'),(51,'Elias Gomes',NULL,NULL,'51_1402360838476.jpg',NULL,'elias-gomes',26,8,NULL,5,1,'2014-06-09 04:56:48'),(52,'Gilmar Machado',NULL,NULL,'52_1402360861504.jpg',NULL,'gilmar-machado',31,4,NULL,5,1,'2014-06-09 04:56:48'),(53,'Carlos Magno de Moura',NULL,NULL,'53_1402360880488.jpg',NULL,'carlos-magno-de-moura',31,6,NULL,5,1,'2014-06-09 04:56:48'),(54,'José Ronaldo de Carvalho',NULL,NULL,'54_1402360906049.jpg',NULL,'jose-ronaldo-de-carvalho',29,5,NULL,5,1,'2014-06-09 04:56:49'),(55,'Antônio Carlos Pannunzio',NULL,NULL,'55_1402360936292.jpg',NULL,'antonio-carlos-pannunzio',35,8,NULL,5,1,'2014-06-09 04:56:49'),(56,'Dárcy Vera',NULL,NULL,'56_1402361281470.jpg',NULL,'darcy-vera',35,28,NULL,5,1,'2014-06-09 04:56:49'),(57,'Mauro Mendes',NULL,NULL,'57_1402361300556.jpg',NULL,'mauro-mendes',51,7,NULL,5,1,'2014-06-09 04:56:49'),(58,'João Alves Filho',NULL,NULL,'58_1402361320928.jpg',NULL,'joao-alves-filho',28,5,NULL,5,1,'2014-06-09 04:56:49'),(59,'Bruno Siqueira',NULL,NULL,'59_1402361340075.jpg',NULL,'bruno-siqueira',31,1,NULL,5,1,'2014-06-09 04:56:49'),(60,'Udo Döhler',NULL,NULL,'60_1402361412185.jpg',NULL,'udo-dohler',42,1,NULL,5,1,'2014-06-09 04:56:49'),(61,'Marcelo Belinati',NULL,NULL,'61_1402361435758.jpg',NULL,'marcelo-belinati',41,16,NULL,5,1,'2014-06-09 04:56:49'),(62,'Manoel Pioneiro',NULL,NULL,'62_1402361458756.jpg',NULL,'manoel-pioneiro',15,8,NULL,5,1,'2014-06-09 04:56:49'),(63,'Dennis Dauttmam',NULL,NULL,'63_1402361482332.jpg',NULL,'dennis-dauttmam',33,6,NULL,5,1,'2014-06-09 04:56:49'),(64,'Rodrigo Neves',NULL,NULL,'64_1402361559413.jpg',NULL,'rodrigo-neves',33,4,NULL,5,1,'2014-06-09 04:56:49'),(65,'Sandro Matos',NULL,NULL,'65_1402361574850.jpg',NULL,'sandro-matos',33,3,NULL,5,1,'2014-06-09 04:56:49'),(66,'Maguito Vilela',NULL,NULL,'66_1402361609320.jpg',NULL,'maguito-vilela',52,1,NULL,5,1,'2014-06-09 04:56:49'),(67,'Rosângela Matheus',NULL,NULL,'67_1402361685462.jpg',NULL,'rosangela-matheus',33,27,NULL,5,1,'2014-06-09 04:56:49'),(68,'Paulo Alexandre Barbosa',NULL,NULL,'68_1402361722896.jpg',NULL,'paulo-alexandre-barbosa',35,8,NULL,5,1,'2014-06-09 04:56:49'),(69,'Valdomiro Lopes',NULL,NULL,'69_1402361746894.jpg',NULL,'valdomiro-lopes',35,7,NULL,5,1,'2014-06-09 04:56:49'),(70,'Donisete Braga',NULL,NULL,'70_1402361769425.jpg',NULL,'donisete-braga',35,4,NULL,5,1,'2014-06-09 04:56:49'),(71,'Alceu Barbosa',NULL,NULL,'71_1402361782412.jpg',NULL,'alceu-barbosa',43,3,NULL,5,1,'2014-06-09 04:56:49'),(72,'Carlaile Pedrosa',NULL,NULL,'72_1402361812254.jpg',NULL,'carlaile-pedrosa',31,8,NULL,5,1,'2014-06-09 04:56:49'),(73,'Cesar Souza Junior',NULL,NULL,'73_1402361840885.jpg',NULL,'cesar-souza-junior',42,28,NULL,5,1,'2014-06-09 04:56:49'),(74,'Rodney Miranda',NULL,NULL,'74_1402361861381.jpg',NULL,'rodney-miranda',32,5,NULL,5,1,'2014-06-09 04:56:49'),(75,'Lauro Michels Sobrinho',NULL,NULL,'75_1402361881656.jpg',NULL,'lauro-michels-sobrinho',35,14,NULL,5,1,'2014-06-09 04:56:50'),(76,'Audifax Barcelos',NULL,NULL,'76_1402361909982.jpg',NULL,'audifax-barcelos',32,7,NULL,5,1,'2014-06-09 04:56:50'),(77,'Sérgio Ribeiro',NULL,NULL,'77_1402361935981.jpg',NULL,'sergio-ribeiro',35,4,NULL,5,1,'2014-06-09 04:56:50'),(78,'Renildo Calheiros',NULL,NULL,'78_1402361981418.jpg',NULL,'renildo-calheiros',26,6,NULL,5,1,'2014-06-09 04:56:50'),(79,'Mauro Nazif',NULL,NULL,'79_1402362001171.jpg',NULL,'mauro-nazif',11,7,NULL,5,1,'2014-06-09 04:56:50'),(80,'Romero Rodrigues',NULL,NULL,'80_1402362018200.jpg',NULL,'romero-rodrigues',25,8,NULL,5,1,'2014-06-09 04:56:50'),(81,'Marco Aurélio Bertaiolli',NULL,NULL,'81_1402362068068.jpg',NULL,'marco-aurelio-bertaiolli',35,28,NULL,5,1,'2014-06-09 04:56:50'),(82,'Clécio Luis',NULL,NULL,'82_1402362089830.jpg',NULL,'clecio-luis',16,26,NULL,5,1,'2014-06-09 04:56:50'),(83,'Gabriel Ferrato',NULL,NULL,'83_1402362104994.jpg',NULL,'gabriel-ferrato',35,8,NULL,5,1,'2014-06-09 04:56:50'),(84,'Geraldo Júnior',NULL,NULL,'84_1402362126681.jpg',NULL,'geraldo-junior',32,13,NULL,5,1,'2014-06-09 04:56:50'),(85,'Rodrigo Agostinho',NULL,NULL,'85_1402362190599.jpg',NULL,'rodrigo-agostinho',35,1,NULL,5,1,'2014-06-09 04:56:50'),(86,'Mamoru Nakashima',NULL,NULL,'86_1402362219711.jpg',NULL,'mamoru-nakashima',35,23,NULL,5,1,'2014-06-09 04:56:50'),(87,'Ruy Muniz',NULL,NULL,'87_1402362264723.jpg',NULL,'ruy-muniz',31,25,NULL,5,1,'2014-06-09 04:56:50'),(88,'Pedro Bigardi',NULL,NULL,'88_1402362290670.jpg',NULL,'pedro-bigardi',35,6,NULL,5,1,'2014-06-09 04:56:50'),(89,'Eduardo Leite',NULL,NULL,'89_1402362315136.jpg',NULL,'eduardo-leite',43,8,NULL,5,1,'2014-06-09 04:56:50'),(90,'Jairo Jorge',NULL,NULL,'90_1402362333327.jpg',NULL,'jairo-jorge',43,4,NULL,5,1,'2014-06-09 04:56:50'),(91,'Luis Claudio Bili',NULL,NULL,'91_1402362366352.jpg',NULL,'luis-claudio-bili',35,16,NULL,5,1,'2014-06-09 04:56:50'),(92,'Alexandre Ferreira',NULL,NULL,'92_1402362441598.jpg',NULL,'alexandre-ferreira',35,8,NULL,5,1,'2014-06-09 07:56:50'),(93,'Carlos Roberto Pupin',NULL,NULL,'93_1402362478574.jpg',NULL,'carlos-roberto-pupin',41,16,NULL,5,1,'2014-06-09 04:56:50'),(94,'Daniela Corrêa',NULL,NULL,'94_1402362495291.jpg',NULL,'daniela-correa',31,4,NULL,5,1,'2014-06-09 04:56:50'),(95,'Antônio Gomide',NULL,NULL,'95_1402362528613.jpg',NULL,'antonio-gomide',52,4,NULL,5,1,'2014-06-09 04:56:51'),(96,'Luciano Rezende',NULL,NULL,'96_1402362543440.jpg',NULL,'luciano-rezende',32,13,NULL,5,1,'2014-06-09 04:56:51'),(97,'Marcus Alexandre',NULL,NULL,'97_1402362560818.jpg',NULL,'marcus-alexandre',12,4,NULL,5,1,'2014-06-09 04:56:51'),(98,'Washington Luiz de Oliveira Gois',NULL,NULL,'98_1402362584159.jpg',NULL,'washington-luiz-de-oliveira-gois',23,25,NULL,5,1,'2014-06-09 04:56:51'),(99,'Rubens Bomtempo',NULL,NULL,'99_1402362604504.jpg',NULL,'rubens-bomtempo',33,7,NULL,5,1,'2014-06-09 04:56:51'),(100,'Reni Pereira',NULL,NULL,'100_1402362621698.jpg',NULL,'reni-pereira',41,7,NULL,5,1,'2014-06-09 04:56:51'),(101,'Maria Antonieta de Brito',NULL,NULL,'101_1402362646309.jpg',NULL,'maria-antonieta-de-brito',35,1,NULL,5,1,'2014-06-09 04:56:51'),(102,'Marcelo Rangel',NULL,NULL,'102_1402362667500.jpg',NULL,'marcelo-rangel',41,13,NULL,5,1,'2014-06-09 04:56:51'),(103,'Junior Matuto',NULL,NULL,'103_1402362760424.jpg',NULL,'junior-matuto',26,7,NULL,5,1,'2014-06-09 04:56:51'),(104,'Napoleão Bernardes Neto',NULL,NULL,'104_1402362961078.jpg',NULL,'napoleao-bernardes-neto',42,8,NULL,5,1,'2014-06-09 04:56:51'),(105,'Guilherme Menezes',NULL,NULL,'105_1402363005388.jpg',NULL,'guilherme-menezes',29,4,NULL,5,1,'2014-06-09 04:56:51'),(106,'Elisa Costa',NULL,NULL,'106_1402363088670.jpg',NULL,'elisa-costa',31,4,NULL,5,1,'2014-06-09 10:56:51'),(107,'Paulo Piau',NULL,NULL,'107_1402363122424.jpg',NULL,'paulo-piau',31,1,NULL,5,1,'2014-06-09 04:56:51'),(108,'Edgar Bueno',NULL,NULL,'108_1402363145857.jpg',NULL,'edgar-bueno',41,3,NULL,5,1,'2014-06-09 04:56:51'),(109,'José Queiroz de Lima',NULL,NULL,'109_1402363263774.jpg',NULL,'jose-queiroz-de-lima',26,3,NULL,5,1,'2014-06-09 04:56:51'),(110,'Paulo Tokuzumi',NULL,NULL,'110_1402363285678.jpg',NULL,'paulo-tokuzumi',35,8,NULL,5,1,'2014-06-09 04:56:51'),(111,'Paulo Hadich',NULL,NULL,'111_1402363315843.jpg',NULL,'paulo-hadich',35,7,NULL,5,1,'2014-06-09 04:56:51'),(112,'Alexandre Von',NULL,NULL,'112_1402363333174.jpg',NULL,'alexandre-von',15,8,NULL,5,1,'2014-06-09 04:56:52'),(113,'José Ortiz Júnior',NULL,NULL,'113_1402363407678.jpg',NULL,'jose-ortiz-junior',35,8,NULL,5,1,'2014-06-09 07:56:52'),(114,'Marco Alba',NULL,NULL,'114_1402363429236.jpg',NULL,'marco-alba',43,1,NULL,5,1,'2014-06-09 04:56:52'),(115,'Cezar Augusto Schirmer',NULL,NULL,'115_1402363591212.jpg',NULL,'cezar-augusto-schirmer',43,1,NULL,5,1,'2014-06-09 07:56:52'),(116,'Gil Arantes',NULL,NULL,'116_1402363625558.jpg',NULL,'gil-arantes',35,5,NULL,5,1,'2014-06-09 04:56:52'),(117,'Valdir Bonatto',NULL,NULL,'117_1402363717478.jpg',NULL,'valdir-bonatto',43,8,NULL,5,1,'2014-06-09 04:56:52'),(118,'Luis Carlos Setim',NULL,NULL,'118_1402363736897.jpg',NULL,'luis-carlos-setim',41,5,NULL,5,1,'2014-06-09 04:56:52'),(119,'Júlio Lóssio',NULL,NULL,'119_1402363760588.jpg',NULL,'julio-lossio',26,1,NULL,5,1,'2014-06-09 04:56:52'),(120,'Paulo Kopschina',NULL,NULL,'120_1402363783290.jpg',NULL,'paulo-kopschina',43,1,NULL,5,1,'2014-06-09 04:56:52'),(121,'Antônio Francisco Neto',NULL,NULL,'121_1402363825276.jpg',NULL,'antonio-francisco-neto',33,1,NULL,5,1,'2014-06-09 04:56:52'),(122,'Walace Guimarães',NULL,NULL,'122_1402363838237.jpg',NULL,'walace-guimaraes',51,1,NULL,5,1,'2014-06-09 04:56:52'),(123,'Teresa Surita',NULL,NULL,'123_1402363852393.jpg',NULL,'teresa-surita',14,1,NULL,5,1,'2014-06-09 04:56:52'),(124,'Carlos Amastha',NULL,NULL,'124_1402363948483.jpg',NULL,'carlos-amastha',17,16,NULL,5,1,'2014-06-09 10:57:14');
/*!40000 ALTER TABLE `politician` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `politician_cover_photo`
--

DROP TABLE IF EXISTS `politician_cover_photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `politician_cover_photo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `photo_filename` varchar(100) NOT NULL,
  `politician_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_politician_cover_photo_politician` (`politician_id`),
  CONSTRAINT `fk_politician_cover_photo_politician` FOREIGN KEY (`politician_id`) REFERENCES `politician` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `politician_cover_photo`
--

LOCK TABLES `politician_cover_photo` WRITE;
/*!40000 ALTER TABLE `politician_cover_photo` DISABLE KEYS */;
INSERT INTO `politician_cover_photo` VALUES (1,'brazil-flag.jpg',1);
/*!40000 ALTER TABLE `politician_cover_photo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `politician_user_vote`
--

DROP TABLE IF EXISTS `politician_user_vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `politician_user_vote` (
  `politician_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vote_type` enum('UP','DOWN') NOT NULL,
  `vote_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`politician_id`,`user_id`),
  KEY `fk_politician_user_vote_user` (`user_id`),
  KEY `fk_politician_user_vote_politician` (`politician_id`),
  CONSTRAINT `fk_politician_user_vote_politician` FOREIGN KEY (`politician_id`) REFERENCES `politician` (`id`),
  CONSTRAINT `fk_politician_user_vote_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `politician_user_vote`
--

LOCK TABLES `politician_user_vote` WRITE;
/*!40000 ALTER TABLE `politician_user_vote` DISABLE KEYS */;
/*!40000 ALTER TABLE `politician_user_vote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promise`
--

DROP TABLE IF EXISTS `promise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `description` text,
  `slug` varchar(255) NOT NULL,
  `evidence_date` date DEFAULT NULL,
  `state` enum('NON_STARTED','STARTED','FULFILLED','PARTIALLY_FULFILLED','DISCARDED') NOT NULL,
  `category_id` int(11) NOT NULL,
  `politician_id` int(11) NOT NULL,
  `registered_by_user_id` int(11) NOT NULL,
  `last_edited_by_user_id` int(11) DEFAULT NULL,
  `registration_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_promise_category` (`category_id`),
  KEY `fk_promise_politician` (`politician_id`),
  KEY `fk_promise_registered_by_user` (`registered_by_user_id`),
  KEY `fk_promise_last_edited_by_user` (`last_edited_by_user_id`),
  CONSTRAINT `fk_promise_category` FOREIGN KEY (`category_id`) REFERENCES `promise_category` (`id`),
  CONSTRAINT `fk_promise_last_edited_by_user` FOREIGN KEY (`last_edited_by_user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_promise_politician` FOREIGN KEY (`politician_id`) REFERENCES `politician` (`id`),
  CONSTRAINT `fk_promise_registered_by_user` FOREIGN KEY (`registered_by_user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promise`
--

LOCK TABLES `promise` WRITE;
/*!40000 ALTER TABLE `promise` DISABLE KEYS */;
INSERT INTO `promise` VALUES (1,'Melhorar todo o sistema de saúde.',NULL,'melhorar-todo-o-sistema-de-saude',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:30'),(2,'Fazer 500 Unidades de Pronto Atendimento (UPAs) 24 horas.',NULL,'fazer-500-unidades-de-pronto-atendimento-(upas)-24-horas',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:30'),(3,'Construir 8.600 unidades básicas de saúde em todo o país.',NULL,'construir-8-600-unidades-basicas-de-saude-em-todo-o-pais',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:30'),(4,'Universalizar o SUS, garantindo mais recursos para o programa, e ampliar o número de profissionais.',NULL,'universalizar-o-sus-garantindo-mais-recursos-para-o-programa-e-ampliar-o-numero-de-profissionais',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:30'),(5,'Implantar o cartão do SUS, com o registro do histórico dos atendimentos.',NULL,'implantar-o-cartao-do-sus-com-o-registro-do-historico-dos-atendimentos',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:30'),(6,'Ampliar o Saúde da Família.',NULL,'ampliar-o-saude-da-familia',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:30'),(7,'Ampliar as Farmácias Populares.',NULL,'ampliar-as-farmacias-populares',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:30'),(8,'Ampliar o Brasil Sorridente.',NULL,'ampliar-o-brasil-sorridente',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:30'),(9,'Ampliar o Serviço de Atendimento Móvel de Urgência (Samu).',NULL,'ampliar-o-servico-de-atendimento-movel-de-urgencia-(samu)',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(10,'Valorizar práticas preventivas.',NULL,'valorizar-praticas-preventivas',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(11,'Garantir atendimento básico, ambulatorial e hospitalar altamente resolutivo em todos os estados.',NULL,'garantir-atendimento-basico-ambulatorial-e-hospitalar-altamente-resolutivo-em-todos-os-estados',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(12,'Melhorar a gestão dos recursos.',NULL,'melhorar-a-gestao-dos-recursos',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(13,'Distribuir gratuitamente remédios para hipertensão e diabetes, usando o programa Aqui tem Farmácia Popular.',NULL,'distribuir-gratuitamente-remedios-para-hipertensao-e-diabetes-usando-o-programa-aqui-tem-farmacia-popular',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(14,'Implantar rede de prevenção de câncer em todo o país',NULL,'implantar-rede-de-prevencao-de-cancer-em-todo-o-pais',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(15,'Ampliar a rede de atendimento para gestantes e crianças de até um ano. Criar clínicas especializadas, maternidades de alto e baixo riscos, UTIs neonatais e ambulâncias do Samu com mini-UTI para bebês, articulando essa rede ao Samu-Cegonha.',NULL,'ampliar-a-rede-de-atendimento-para-gestantes-e-criancas-de-ate-um-ano-criar-clinicas-especializadas-maternidades-de-alto-e-baixo-riscos-utis-neonatais-e-ambulancias-do-samu-com-mini-uti-para-bebes-articulando-essa-rede-ao-samu-cegonha',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(16,'Articular uma rede integrada pública e privada, custeada pelo SUS, para tratar dependentes de crack. O SUS deverá dar acompanhamento psicossocial após a internação.',NULL,'articular-uma-rede-integrada-publica-e-privada-custeada-pelo-sus-para-tratar-dependentes-de-crack-o-sus-devera-dar-acompanhamento-psicossocial-apos-a-internacao',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(17,'Dar atenção a programas de saúde mental, especialmente para tratamento de alcoolismo e dependência de drogas.',NULL,'dar-atencao-a-programas-de-saude-mental-especialmente-para-tratamento-de-alcoolismo-e-dependencia-de-drogas',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(18,'Acabar com as filas para exames e atendimentos especializados.',NULL,'acabar-com-as-filas-para-exames-e-atendimentos-especializados',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(19,'Criar cursos de capacitação para quem atende à população.',NULL,'criar-cursos-de-capacitacao-para-quem-atende-a-populacao',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(20,'Ter autossuficiência científica na produção de fármacos.',NULL,'ter-autossuficiencia-cientifica-na-producao-de-farmacos',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(21,'Ampliar a fabricação de genéricos.',NULL,'ampliar-a-fabricacao-de-genericos',NULL,'NON_STARTED',1,1,1,NULL,'2014-06-08 21:51:31'),(22,'Erradicar a miséria e conduzir os brasileiros ao padrão da classe média, melhorando a vida de 21,5 milhões de pessoas que vivem na pobreza absoluta.',NULL,'erradicar-a-miseria-e-conduzir-os-brasileiros-ao-padrao-da-classe-media-melhorando-a-vida-de-215-milhoes-de-pessoas-que-vivem-na-pobreza-absoluta',NULL,'NON_STARTED',2,1,1,NULL,'2014-06-08 21:51:31'),(23,'Continuar reduzindo as desigualdades.',NULL,'continuar-reduzindo-as-desigualdades',NULL,'NON_STARTED',2,1,1,NULL,'2014-06-08 21:51:31'),(24,'Ampliar programas, em especial o Bolsa Família, e implantar novos.',NULL,'ampliar-programas-em-especial-o-bolsa-familia-e-implantar-novos',NULL,'NON_STARTED',2,1,1,NULL,'2014-06-08 21:51:31'),(25,'Ampliar o Bolsa Família para famílias sem filhos.',NULL,'ampliar-o-bolsa-familia-para-familias-sem-filhos',NULL,'NON_STARTED',2,1,1,NULL,'2014-06-08 21:51:31'),(26,'Ampliar as iniciativas de promoção de igualdade de direitos e oportunidades para mulheres, negros, populações indígenas, idosos e setores discriminados.',NULL,'ampliar-as-iniciativas-de-promocao-de-igualdade-de-direitos-e-oportunidades-para-mulheres-negros-populacoes-indigenas-idosos-e-setores-discriminados',NULL,'NON_STARTED',2,1,1,NULL,'2014-06-08 21:51:31'),(27,'Lutar pela inserção plena de portadores de deficiências.',NULL,'lutar-pela-insercao-plena-de-portadores-de-deficiencias',NULL,'NON_STARTED',2,1,1,NULL,'2014-06-08 21:51:31'),(28,'Aumentar para 7% do PIB os investimentos públicos em educação.',NULL,'aumentar-para-7-do-pib-os-investimentos-publicos-em-educacao',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:31'),(29,'Erradicar o analfabetismo.',NULL,'erradicar-o-analfabetismo',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:31'),(30,'Dar prioridade à qualidade da educação.',NULL,'dar-prioridade-a-qualidade-da-educacao',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:31'),(31,'Construir seis mil creches e pré-escolas.',NULL,'construir-seis-mil-creches-e-pre-escolas',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(32,'Dar bolsa de estudos e apoio para que os alunos não abandonem a escola. ',NULL,'dar-bolsa-de-estudos-e-apoio-para-que-os-alunos-nao-abandonem-a-escola',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(33,'Dar especial atenção à formação continuada de professores para os níveis fundamental e médio.',NULL,'dar-especial-atencao-a-formacao-continuada-de-professores-para-os-niveis-fundamental-e-medio',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(34,'Possibilitar que os professores tenham, ao menos, curso universitário e remuneração condizente com sua importância.',NULL,'possibilitar-que-os-professores-tenham-ao-menos-curso-universitario-e-remuneracao-condizente-com-sua-importancia',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(35,'Manter um piso salarial nacional para professores.',NULL,'manter-um-piso-salarial-nacional-para-professores',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(36,'Equipar as escolas com banda larga gratuita.',NULL,'equipar-as-escolas-com-banda-larga-gratuita',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(37,'Construir mais escolas federais.',NULL,'construir-mais-escolas-federais',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(38,'Proteger as crianças e os jovens da violência, do assédio das drogas e da imposição do trabalho em detrimento da formação escolar e acadêmica.',NULL,'proteger-as-criancas-e-os-jovens-da-violencia-do-assedio-das-drogas-e-da-imposicao-do-trabalho-em-detrimento-da-formacao-escolar-e-academica',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(39,'Construir escolas técnicas em municípios com mais de 50 mil habitantes ou que sejam polos de regiões.',NULL,'construir-escolas-tecnicas-em-municipios-com-mais-de-50-mil-habitantes-ou-que-sejam-polos-de-regioes',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(40,'Criar o ProMédio, programa de bolsa de estudo em instituições de ensino médio técnico, nos moldes do Universidade para Todos (ProUni).',NULL,'criar-o-promedio-programa-de-bolsa-de-estudo-em-instituicoes-de-ensino-medio-tecnico-nos-moldes-do-universidade-para-todos-(prouni)',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(41,'Criar vagas em escolas privadas também por meio de financiamento com prazos longos e juros baixos. Se o aluno formado prestar serviço civil, terá desconto grande, chegando a 100% se for técnico de saúde.',NULL,'criar-vagas-em-escolas-privadas-tambem-por-meio-de-financiamento-com-prazos-longos-e-juros-baixos-se-o-aluno-formado-prestar-servico-civil-tera-desconto-grande-chegando-a-100-se-for-tecnico-de-saude',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(42,'Garantir a qualificação do ensino universitário, com ênfase na pós-graduação.',NULL,'garantir-a-qualificacao-do-ensino-universitario-com-enfase-na-pos-graduacao',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(43,'Expandir e interiorizar as universidades federais.',NULL,'expandir-e-interiorizar-as-universidades-federais',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(44,'Ampliar o ProUni.',NULL,'ampliar-o-prouni',NULL,'NON_STARTED',3,1,1,NULL,'2014-06-08 21:51:32'),(45,'Fazer a inclusão digital, com banda larga em todo o país.',NULL,'fazer-a-inclusao-digital-com-banda-larga-em-todo-o-pais',NULL,'NON_STARTED',4,1,1,NULL,'2014-06-08 21:51:33'),(46,'Transformar o Brasil em potência científica e tecnológica.',NULL,'transformar-o-brasil-em-potencia-cientifica-e-tecnologica',NULL,'NON_STARTED',4,1,1,NULL,'2014-06-08 21:51:33'),(47,'Dar ênfase à formação de engenheiros.',NULL,'dar-enfase-a-formacao-de-engenheiros',NULL,'NON_STARTED',4,1,1,NULL,'2014-06-08 21:51:33'),(48,'Expandir recursos para pesquisa e ampliar as bolsas da Capes e e do CNPq.',NULL,'expandir-recursos-para-pesquisa-e-ampliar-as-bolsas-da-capes-e-e-do-cnpq',NULL,'NON_STARTED',4,1,1,NULL,'2014-06-08 21:51:33'),(49,'Ampliar o registro de patentes.',NULL,'ampliar-o-registro-de-patentes',NULL,'NON_STARTED',4,1,1,NULL,'2014-06-08 21:51:33'),(50,'Privilegiar as pesquisas em biotecnologia; nanotecnologia; robótica; novos materiais; tecnologia da informação e da comunicação; saúde e produção de fármacos; biocombustíveis e energias renováveis; agricultura; biodiversidade; Amazônia e semiárido; área n',NULL,'privilegiar-as-pesquisas-em-biotecnologia-nanotecnologia-robotica-novos-materiais-tecnologia-da-informacao-e-da-comunicacao-saude-e-producao-de-farmacos-biocombustiveis-e-energias-renovaveis-agricultura-biodiversidade-amazonia-e-semiarido-area-n',NULL,'NON_STARTED',4,1,1,NULL,'2014-06-08 21:51:33'),(51,'Construir seis mil quadras poliesportivas em escolas públicas com mais de 500 alunos.',NULL,'construir-seis-mil-quadras-poliesportivas-em-escolas-publicas-com-mais-de-500-alunos',NULL,'NON_STARTED',5,1,1,NULL,'2014-06-08 21:51:33'),(52,'Cobrir quatro mil quadras existentes.',NULL,'cobrir-quatro-mil-quadras-existentes',NULL,'NON_STARTED',5,1,1,NULL,'2014-06-08 21:51:33'),(53,'Investir na formação de atletas até 2014.',NULL,'investir-na-formacao-de-atletas-ate-2014',NULL,'NON_STARTED',5,1,1,NULL,'2014-06-08 21:51:33'),(54,'Construir 800 complexos esportivos, culturais e de lazer, em todos os lugares do país.',NULL,'construir-800-complexos-esportivos-culturais-e-de-lazer-em-todos-os-lugares-do-pais',NULL,'NON_STARTED',5,1,1,NULL,'2014-06-08 21:51:33'),(55,'Ampliar o Bolsa Atleta e valorizar o profissional de educação física.',NULL,'ampliar-o-bolsa-atleta-e-valorizar-o-profissional-de-educacao-fisica',NULL,'NON_STARTED',5,1,1,NULL,'2014-06-08 21:51:33'),(56,'Criar o Sistema Nacional de Incentivo ao Esporte e ao Lazer.',NULL,'criar-o-sistema-nacional-de-incentivo-ao-esporte-e-ao-lazer',NULL,'NON_STARTED',5,1,1,NULL,'2014-06-08 21:51:33'),(57,'Fazer dos dois eventos um instrumento de inclusão social de crianças e jovens.',NULL,'fazer-dos-dois-eventos-um-instrumento-de-inclusao-social-de-criancas-e-jovens',NULL,'NON_STARTED',6,1,1,NULL,'2014-06-08 21:51:33'),(58,'Qualificar jovens e adultos para atender às demandas criadas pela Copa do Mundo de 2014.',NULL,'qualificar-jovens-e-adultos-para-atender-as-demandas-criadas-pela-copa-do-mundo-de-2014',NULL,'NON_STARTED',6,1,1,NULL,'2014-06-08 21:51:33'),(59,'Vencer o déficit habitacional nesta década.',NULL,'vencer-o-deficit-habitacional-nesta-decada',NULL,'NON_STARTED',7,1,1,NULL,'2014-06-08 21:51:33'),(60,'Contratar a construção de mais dois milhões de moradias no programa Minha Casa, Minha Vida.',NULL,'contratar-a-construcao-de-mais-dois-milhoes-de-moradias-no-programa-minha-casa-minha-vida',NULL,'NON_STARTED',7,1,1,NULL,'2014-06-08 21:51:33'),(61,'Incluir eletrodomésticos e móveis na segunda fase do Minha Casa, Minha Vida.',NULL,'incluir-eletrodomesticos-e-moveis-na-segunda-fase-do-minha-casa-minha-vida',NULL,'NON_STARTED',7,1,1,NULL,'2014-06-08 21:51:33'),(62,'Continuar a democratizar o acesso à terra urbana e a regularizar propriedades nos termos da lei.',NULL,'continuar-a-democratizar-o-acesso-a-terra-urbana-e-a-regularizar-propriedades-nos-termos-da-lei',NULL,'NON_STARTED',7,1,1,NULL,'2014-06-08 21:51:33'),(63,'Criar uma diretoria ou superintendência na Caixa Econômica Federal para investir em habitação rural.',NULL,'criar-uma-diretoria-ou-superintendencia-na-caixa-economica-federal-para-investir-em-habitacao-rural',NULL,'NON_STARTED',7,1,1,NULL,'2014-06-08 21:51:34'),(64,'Investir na prevenção de enchentes no país.',NULL,'investir-na-prevencao-de-enchentes-no-pais',NULL,'NON_STARTED',8,1,1,NULL,'2014-06-08 21:51:34'),(65,'Gastar R$ 11 bilhões em drenagem e proteção de encostas, para combater o problema da ocupação em áreas de risco.',NULL,'gastar-rdollar-11-bilhoes-em-drenagem-e-protecao-de-encostas-para-combater-o-problema-da-ocupacao-em-areas-de-risco',NULL,'NON_STARTED',8,1,1,NULL,'2014-06-08 21:51:34'),(66,'Universalizar o saneamento.',NULL,'universalizar-o-saneamento',NULL,'NON_STARTED',8,1,1,NULL,'2014-06-08 21:51:34'),(67,'Investir R$ 34 bilhões em obras de abastecimento de água e saneamento básico.',NULL,'investir-rdollar-34-bilhoes-em-obras-de-abastecimento-de-agua-e-saneamento-basico',NULL,'NON_STARTED',8,1,1,NULL,'2014-06-08 21:51:34'),(68,'Empenhar-se para promover uma profunda reforma urbana, que beneficie prioritariamente as camadas mais desprotegidas da população.',NULL,'empenhar-se-para-promover-uma-profunda-reforma-urbana-que-beneficie-prioritariamente-as-camadas-mais-desprotegidas-da-populacao',NULL,'NON_STARTED',8,1,1,NULL,'2014-06-08 21:51:34'),(69,'Construir 2.883 postos de polícia comunitária.',NULL,'construir-2-883-postos-de-policia-comunitaria',NULL,'NON_STARTED',9,1,1,NULL,'2014-06-08 21:51:35'),(70,'Fazer novo modelo de segurança inspirada nas Unidades de Polícia Pacificadora (UPPs) do Rio.',NULL,'fazer-novo-modelo-de-seguranca-inspirada-nas-unidades-de-policia-pacificadora-(upps)-do-rio',NULL,'NON_STARTED',9,1,1,NULL,'2014-06-08 21:51:35'),(71,'Continuar e ampliar o Programa Nacional de Segurança Pública (Pronasci), a Bolsa-Formação e o Territórios da Paz.',NULL,'continuar-e-ampliar-o-programa-nacional-de-seguranca-publica-(pronasci)-a-bolsa-formacao-e-o-territorios-da-paz',NULL,'NON_STARTED',9,1,1,NULL,'2014-06-08 21:51:35'),(72,'Estimular políticas de segurança integradas entre estados, municípios e União.',NULL,'estimular-politicas-de-seguranca-integradas-entre-estados-municipios-e-uniao',NULL,'NON_STARTED',9,1,1,NULL,'2014-06-08 21:51:35'),(73,'Incrementar investimentos em infraestrutura nas áreas com maior índice de violência.',NULL,'incrementar-investimentos-em-infraestrutura-nas-areas-com-maior-indice-de-violencia',NULL,'NON_STARTED',9,1,1,NULL,'2014-06-08 21:51:35'),(74,'Fazer uma reforma radical no sistema penitenciário e mudar as leis processuais penais.',NULL,'fazer-uma-reforma-radical-no-sistema-penitenciario-e-mudar-as-leis-processuais-penais',NULL,'NON_STARTED',9,1,1,NULL,'2014-06-08 21:51:35'),(75,'Reequipar as Forças Armadas e fortalecer o Ministério da Defesa.',NULL,'reequipar-as-forcas-armadas-e-fortalecer-o-ministerio-da-defesa',NULL,'NON_STARTED',9,1,1,NULL,'2014-06-08 21:51:35'),(76,'Fortalecer a Polícia Federal e a Força Nacional de Segurança Pública.',NULL,'fortalecer-a-policia-federal-e-a-forca-nacional-de-seguranca-publica',NULL,'NON_STARTED',9,1,1,NULL,'2014-06-08 21:51:35'),(77,'Dar mais capacitação federal às áreas de fronteira e inteligência.',NULL,'dar-mais-capacitacao-federal-as-areas-de-fronteira-e-inteligencia',NULL,'NON_STARTED',9,1,1,NULL,'2014-06-08 21:51:35'),(78,'Ampliar o controle das fronteiras para coibir a entrada de armas e de drogas.',NULL,'ampliar-o-controle-das-fronteiras-para-coibir-a-entrada-de-armas-e-de-drogas',NULL,'NON_STARTED',9,1,1,NULL,'2014-06-08 21:51:35'),(79,'Comprar dez veículos aéreos não tripulados produzidos em Israel.',NULL,'comprar-dez-veiculos-aereos-nao-tripulados-produzidos-em-israel',NULL,'NON_STARTED',9,1,1,NULL,'2014-06-08 21:51:35'),(80,'Lutar contra o crime organizado, especialmente a lavagem de dinheiro, e o roubo de cargas.',NULL,'lutar-contra-o-crime-organizado-especialmente-a-lavagem-de-dinheiro-e-o-roubo-de-cargas',NULL,'NON_STARTED',9,1,1,NULL,'2014-06-08 21:51:36'),(81,'Modernizar o transporte público nas grandes cidades.',NULL,'modernizar-o-transporte-publico-nas-grandes-cidades',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(82,'Investir R$ 18 bilhões em obras de transporte público.',NULL,'investir-rdollar-18-bilhoes-em-obras-de-transporte-publico',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(83,'Implantar transporte seguro, barato e eficiente.',NULL,'implantar-transporte-seguro-barato-e-eficiente',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(84,'Ampliar o aeroporto Galeão-Tom Jobim, com a conclusão do terminal 2 e melhorias no terminal 1.',NULL,'ampliar-o-aeroporto-galeao-tom-jobim-com-a-conclusao-do-terminal-2-e-melhorias-no-terminal-1',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(85,'Fazer novos aeroportos em Goiânia, Cuiabá e Porto Seguro (BA).',NULL,'fazer-novos-aeroportos-em-goiania-cuiaba-e-porto-seguro-(ba)',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(86,'Ampliar os aeroportos Afonso Pena (Curitiba) e Guarulhos.',NULL,'ampliar-os-aeroportos-afonso-pena-(curitiba)-e-guarulhos',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(87,'Fazer nova pista no aeroporto de Confins (Belo Horizonte).',NULL,'fazer-nova-pista-no-aeroporto-de-confins-(belo-horizonte)',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(88,'Construir o aeroporto de São Gonçalo do Amarante (RN).',NULL,'construir-o-aeroporto-de-sao-goncalo-do-amarante-(rn)',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(89,'Fazer o trem de alta velocidade entre Rio e São Paulo.',NULL,'fazer-o-trem-de-alta-velocidade-entre-rio-e-sao-paulo',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(90,'Expandir e construir metrôs nas principais aglomerações urbanas.',NULL,'expandir-e-construir-metros-nas-principais-aglomeracoes-urbanas',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(91,'Ampliar o Trensurb, em Porto Alegre.',NULL,'ampliar-o-trensurb-em-porto-alegre',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(92,'Duplicar as rodovias BR-116 e BR-386, no Rio Grande do Sul.',NULL,'duplicar-as-rodovias-br-116-e-br-386-no-rio-grande-do-sul',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(93,'Estender a rodovia BR-110 (RN).',NULL,'estender-a-rodovia-br-110-(rn)',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(94,'Duplicar e melhorar as estradas Manaus-Porto Velho, Cuiabá-Santarém, BR-060 (em Goiás), BR-470 (em Santa Catarina), BR-381 (de Belo Horizonte a Governador Valadares, em Minas) e BR-040 (de Belo Horizonte ao Rio).',NULL,'duplicar-e-melhorar-as-estradas-manaus-porto-velho-cuiaba-santarem-br-060-(em-goias)-br-470-(em-santa-catarina)-br-381-(de-belo-horizonte-a-governador-valadares-em-minas)-e-br-040-(de-belo-horizonte-ao-rio)',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(95,'Concluir a Via Expressa em Salvador.',NULL,'concluir-a-via-expressa-em-salvador',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(96,'Ampliar e modernizar os portos de Salvador, Vitória, Itaqui (MA), Suape (PE) e Cabedelo (PB).',NULL,'ampliar-e-modernizar-os-portos-de-salvador-vitoria-itaqui-(ma)-suape-(pe)-e-cabedelo-(pb)',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(97,'Fazer 51 grandes obras viárias, como novos corredores de transporte, mais metrô e veículos leve sobre trilhos.',NULL,'fazer-51-grandes-obras-viarias-como-novos-corredores-de-transporte-mais-metro-e-veiculos-leve-sobre-trilhos',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:36'),(98,'Eliminar os gargalos que limitam o crescimento econômico, especialmente em transportes e condições de armazenagem.',NULL,'eliminar-os-gargalos-que-limitam-o-crescimento-economico-especialmente-em-transportes-e-condicoes-de-armazenagem',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:37'),(99,'Investir em transporte de carga.',NULL,'investir-em-transporte-de-carga',NULL,'NON_STARTED',10,1,1,NULL,'2014-06-08 21:51:37'),(100,'Continuar reajustando o salário-mínimo acima da inflação.',NULL,'continuar-reajustando-o-salario-minimo-acima-da-inflacao',NULL,'NON_STARTED',11,1,1,NULL,'2014-06-08 21:51:37'),(101,'Criar as condições para repetir a criação de 14 milhões a 15 milhões de empregos com carteira assinada.',NULL,'criar-as-condicoes-para-repetir-a-criacao-de-14-milhoes-a-15-milhoes-de-empregos-com-carteira-assinada',NULL,'NON_STARTED',11,1,1,NULL,'2014-06-08 21:51:37'),(102,'Fazer do Brasil um país de pleno emprego.',NULL,'fazer-do-brasil-um-pais-de-pleno-emprego',NULL,'NON_STARTED',11,1,1,NULL,'2014-06-08 21:51:37'),(103,'Manter diálogo com os sindicatos para definir as grandes linhas das políticas trabalhistas.',NULL,'manter-dialogo-com-os-sindicatos-para-definir-as-grandes-linhas-das-politicas-trabalhistas',NULL,'NON_STARTED',11,1,1,NULL,'2014-06-08 21:51:37'),(104,'Combater o trabalho infantil e degradante, especialmente as manifestações residuais de trabalho escravo.',NULL,'combater-o-trabalho-infantil-e-degradante-especialmente-as-manifestacoes-residuais-de-trabalho-escravo',NULL,'NON_STARTED',11,1,1,NULL,'2014-06-08 21:51:37'),(105,'Dar atenção especial ao acesso de jovens e pessoas de segmentos mais discriminados ao mercado formal de trabalho.',NULL,'dar-atencao-especial-ao-acesso-de-jovens-e-pessoas-de-segmentos-mais-discriminados-ao-mercado-formal-de-trabalho',NULL,'NON_STARTED',11,1,1,NULL,'2014-06-08 21:51:37'),(106,'Reduzir a zero os tributos sobre investimentos para aumentar a taxa de crescimento do país.',NULL,'reduzir-a-zero-os-tributos-sobre-investimentos-para-aumentar-a-taxa-de-crescimento-do-pais',NULL,'NON_STARTED',12,1,1,NULL,'2014-06-08 21:51:37'),(107,'Reduzir os impostos cobrados de empresas de ônibus, com obrigação de repasse do benefício para o preço das passagens.',NULL,'reduzir-os-impostos-cobrados-de-empresas-de-onibus-com-obrigacao-de-repasse-do-beneficio-para-o-preco-das-passagens',NULL,'NON_STARTED',12,1,1,NULL,'2014-06-08 21:51:37'),(108,'Reduzir os impostos sobre empresas de saneamento para impulsionar mais obras de água e esgoto.',NULL,'reduzir-os-impostos-sobre-empresas-de-saneamento-para-impulsionar-mais-obras-de-agua-e-esgoto',NULL,'NON_STARTED',12,1,1,NULL,'2014-06-08 21:51:37'),(109,'Reduzir os tributos sobre energia elétrica.',NULL,'reduzir-os-tributos-sobre-energia-eletrica',NULL,'NON_STARTED',12,1,1,NULL,'2014-06-08 21:51:37'),(110,'Reduzir os impostos sobre a folha de pagamento das empresas para estimular a geração de mais empregos.',NULL,'reduzir-os-impostos-sobre-a-folha-de-pagamento-das-empresas-para-estimular-a-geracao-de-mais-empregos',NULL,'NON_STARTED',12,1,1,NULL,'2014-06-08 21:51:37'),(111,'Possibilitar a devolução imediata do crédito de ICMS às empresas exportadoras.',NULL,'possibilitar-a-devolucao-imediata-do-credito-de-icms-as-empresas-exportadoras',NULL,'NON_STARTED',12,1,1,NULL,'2014-06-08 21:51:37'),(112,'Incentivar uma reforma para simplificar os tributos, mesmo que seja de forma fatiada.',NULL,'incentivar-uma-reforma-para-simplificar-os-tributos-mesmo-que-seja-de-forma-fatiada',NULL,'NON_STARTED',12,1,1,NULL,'2014-06-08 21:51:37'),(113,'Trabalhar para acabar com a guerra fiscal entre os estados.',NULL,'trabalhar-para-acabar-com-a-guerra-fiscal-entre-os-estados',NULL,'NON_STARTED',12,1,1,NULL,'2014-06-08 21:51:37'),(114,'Defender a desoneração da folha de salários. Para não prejudicar o financiamento à Previdência, o Tesouro faria a compensação.',NULL,'defender-a-desoneracao-da-folha-de-salarios-para-nao-prejudicar-o-financiamento-a-previdencia-o-tesouro-faria-a-compensacao',NULL,'NON_STARTED',12,1,1,NULL,'2014-06-08 21:51:37'),(115,'Trabalhar para garantir a devolução automática de todos os créditos a que as empresas têm direito. Possibilitar a devolução imediata do crédito de ICMS às empresas exportadoras.',NULL,'trabalhar-para-garantir-a-devolucao-automatica-de-todos-os-creditos-a-que-as-empresas-tem-direito-possibilitar-a-devolucao-imediata-do-credito-de-icms-as-empresas-exportadoras',NULL,'NON_STARTED',12,1,1,NULL,'2014-06-08 21:51:37'),(116,'Informatizar o sistema de tributos para alargar a base da arrecadação e diminuir as alíquotas.',NULL,'informatizar-o-sistema-de-tributos-para-alargar-a-base-da-arrecadacao-e-diminuir-as-aliquotas',NULL,'NON_STARTED',12,1,1,NULL,'2014-06-08 21:51:37'),(117,'Combater a corrupção.',NULL,'combater-a-corrupcao',NULL,'NON_STARTED',13,1,1,NULL,'2014-06-08 21:51:37'),(118,'Ter critérios tanto políticos quanto técnicos para preencher cargos públicos.',NULL,'ter-criterios-tanto-politicos-quanto-tecnicos-para-preencher-cargos-publicos',NULL,'NON_STARTED',13,1,1,NULL,'2014-06-08 21:51:37'),(119,'Concretizar, com o Congresso, as reformas institucionais, como a política e a tributária.',NULL,'concretizar-com-o-congresso-as-reformas-institucionais-como-a-politica-e-a-tributaria',NULL,'NON_STARTED',13,1,1,NULL,'2014-06-08 21:51:37'),(120,'Não promover a reforma da Previdência, mas pode ser feito um \"ajuste marginal\".',NULL,'nao-promover-a-reforma-da-previdencia-mas-pode-ser-feito-um-\"ajuste-marginal\"',NULL,'NON_STARTED',13,1,1,NULL,'2014-06-08 21:51:38'),(121,'Fazer o PAC 2, com mais força nas áreas de habitação, saúde, educação e segurança.',NULL,'fazer-o-pac-2-com-mais-forca-nas-areas-de-habitacao-saude-educacao-e-seguranca',NULL,'NON_STARTED',13,1,1,NULL,'2014-06-08 21:51:38'),(122,'Estimular a parceria entre os setores público e privado.',NULL,'estimular-a-parceria-entre-os-setores-publico-e-privado',NULL,'NON_STARTED',13,1,1,NULL,'2014-06-08 21:51:38'),(123,'Não fazer ajuste fiscal (o clássico, com corte indiscriminado de gastos), mas não abandonar a estabilidade ou o controle de despesas.',NULL,'nao-fazer-ajuste-fiscal-(o-classico-com-corte-indiscriminado-de-gastos)-mas-nao-abandonar-a-estabilidade-ou-o-controle-de-despesas',NULL,'NON_STARTED',14,1,1,NULL,'2014-06-08 21:51:38'),(124,'Fazer uma reforma do Estado para dar mais transparência ao governo e eficácia no combate à corrupção.',NULL,'fazer-uma-reforma-do-estado-para-dar-mais-transparencia-ao-governo-e-eficacia-no-combate-a-corrupcao',NULL,'NON_STARTED',14,1,1,NULL,'2014-06-08 21:51:38'),(125,'Elevar a poupança e o investimento público, estimulando também o investimento privado.',NULL,'elevar-a-poupanca-e-o-investimento-publico-estimulando-tambem-o-investimento-privado',NULL,'NON_STARTED',14,1,1,NULL,'2014-06-08 21:51:38'),(126,'Manter o controle da inflação. ',NULL,'manter-o-controle-da-inflacao',NULL,'NON_STARTED',15,1,1,NULL,'2014-06-08 21:51:38'),(127,'Manter o câmbio flutuante.',NULL,'manter-o-cambio-flutuante',NULL,'NON_STARTED',15,1,1,NULL,'2014-06-08 21:51:38'),(128,'Trabalhar para reduzir fortemente os juros. Para isso, reduzir a dívida líquida em relação ao PIB para cerca de 30% em 2014.',NULL,'trabalhar-para-reduzir-fortemente-os-juros-para-isso-reduzir-a-divida-liquida-em-relacao-ao-pib-para-cerca-de-30-em-2014',NULL,'NON_STARTED',15,1,1,NULL,'2014-06-08 21:51:38'),(129,'Agregar valor às riquezas do país e produzir tudo o que for possível no Brasil.',NULL,'agregar-valor-as-riquezas-do-pais-e-produzir-tudo-o-que-for-possivel-no-brasil',NULL,'NON_STARTED',16,1,1,NULL,'2014-06-08 21:51:38'),(130,'Expandir a indústria naval.',NULL,'expandir-a-industria-naval',NULL,'NON_STARTED',16,1,1,NULL,'2014-06-08 21:51:38'),(131,'Construir cinco refinarias, uma delas a Abreu e Lima (PE), com tecnologia de ponta.',NULL,'construir-cinco-refinarias-uma-delas-a-abreu-e-lima-(pe)-com-tecnologia-de-ponta',NULL,'NON_STARTED',16,1,1,NULL,'2014-06-08 21:51:38'),(132,'Defender a abertura de capital da Infraero, mantendo controle estatal.',NULL,'defender-a-abertura-de-capital-da-infraero-mantendo-controle-estatal',NULL,'NON_STARTED',16,1,1,NULL,'2014-06-08 21:51:38'),(133,'Rever o marco regulatório da mineração, para aumentar a arrecadação de royalties.',NULL,'rever-o-marco-regulatorio-da-mineracao-para-aumentar-a-arrecadacao-de-royalties',NULL,'NON_STARTED',16,1,1,NULL,'2014-06-08 21:51:38'),(134,'Criar um ministério para pequenas e médias empresas.',NULL,'criar-um-ministerio-para-pequenas-e-medias-empresas',NULL,'NON_STARTED',17,1,1,NULL,'2014-06-08 21:51:38'),(135,'Fortalecer a política de microcrédito.',NULL,'fortalecer-a-politica-de-microcredito',NULL,'NON_STARTED',17,1,1,NULL,'2014-06-08 21:51:38'),(136,'Ampliar o limite de enquadramento no Super Simples e no Microempreendedor individual.',NULL,'ampliar-o-limite-de-enquadramento-no-super-simples-e-no-microempreendedor-individual',NULL,'NON_STARTED',17,1,1,NULL,'2014-06-08 21:51:38'),(137,'Estimular e favorecer o empreendedorismo, com políticas tributárias, de crédito, ambientais, de suporte tecnológico, de qualificação profissional e de ampliação de mercados.',NULL,'estimular-e-favorecer-o-empreendedorismo-com-politicas-tributarias-de-credito-ambientais-de-suporte-tecnologico-de-qualificacao-profissional-e-de-ampliacao-de-mercados',NULL,'NON_STARTED',17,1,1,NULL,'2014-06-08 21:51:38'),(138,'Defender tratamento diferenciado aos estados produtores na distribuição de royalties do petróleo.',NULL,'defender-tratamento-diferenciado-aos-estados-produtores-na-distribuicao-de-royalties-do-petroleo',NULL,'NON_STARTED',18,1,1,NULL,'2014-06-08 21:51:38'),(139,'Usar os recursos do pré-sal em educação, saúde, cultura, combate à pobreza, meio ambiente, ciência e tecnologia.',NULL,'usar-os-recursos-do-pre-sal-em-educacao-saude-cultura-combate-a-pobreza-meio-ambiente-ciencia-e-tecnologia',NULL,'NON_STARTED',18,1,1,NULL,'2014-06-08 21:51:38'),(140,'Com os recursos do pré-sal, tornar o Brasil a quinta maior economia do mundo.',NULL,'com-os-recursos-do-pre-sal-tornar-o-brasil-a-quinta-maior-economia-do-mundo',NULL,'NON_STARTED',18,1,1,NULL,'2014-06-08 21:51:38'),(141,'Não privatizar a Petrobras e o pré-sal.',NULL,'nao-privatizar-a-petrobras-e-o-pre-sal',NULL,'NON_STARTED',18,1,1,NULL,'2014-06-08 21:51:39'),(142,'Fazer uma política com ênfase na produção de energia renovável e na pesquisa de novas fontes limpas. Construir parques eólicos.',NULL,'fazer-uma-politica-com-enfase-na-producao-de-energia-renovavel-e-na-pesquisa-de-novas-fontes-limpas-construir-parques-eolicos',NULL,'NON_STARTED',19,1,1,NULL,'2014-06-08 21:51:39'),(143,'Desenvolver o potencial hidrelétrico do país.',NULL,'desenvolver-o-potencial-hidreletrico-do-pais',NULL,'NON_STARTED',19,1,1,NULL,'2014-06-08 21:51:39'),(144,'Ampliar a liderança mundial do Brasil na produção de energia limpa.',NULL,'ampliar-a-lideranca-mundial-do-brasil-na-producao-de-energia-limpa',NULL,'NON_STARTED',19,1,1,NULL,'2014-06-08 21:51:39'),(145,'Expandir o etanol na matriz energética brasileira e ampliar a participação do combustível na matriz mundial.',NULL,'expandir-o-etanol-na-matriz-energetica-brasileira-e-ampliar-a-participacao-do-combustivel-na-matriz-mundial',NULL,'NON_STARTED',19,1,1,NULL,'2014-06-08 21:51:39'),(146,'Incentivar a produção de biocombustíveis.',NULL,'incentivar-a-producao-de-biocombustiveis',NULL,'NON_STARTED',19,1,1,NULL,'2014-06-08 21:51:39'),(147,'Reduzir em 80% o desmatamento na Amazônia.',NULL,'reduzir-em-80-o-desmatamento-na-amazonia',NULL,'NON_STARTED',20,1,1,NULL,'2014-06-08 21:51:39'),(148,'Ter tolerância zero com desmatamento em qualquer bioma.',NULL,'ter-tolerancia-zero-com-desmatamento-em-qualquer-bioma',NULL,'NON_STARTED',20,1,1,NULL,'2014-06-08 21:51:39'),(149,'Incentivar o reflorestamento em áreas degradadas.',NULL,'incentivar-o-reflorestamento-em-areas-degradadas',NULL,'NON_STARTED',20,1,1,NULL,'2014-06-08 21:51:39'),(150,'Antecipar o cumprimento da meta de reduzir as emissões de gases do efeito estufa em 36% a 39% até 2020.',NULL,'antecipar-o-cumprimento-da-meta-de-reduzir-as-emissoes-de-gases-do-efeito-estufa-em-36-a-39-ate-2020',NULL,'NON_STARTED',20,1,1,NULL,'2014-06-08 21:51:39'),(151,'Dar prioridade à economia de baixo carbono, consolidando o modelo de energia renovável.',NULL,'dar-prioridade-a-economia-de-baixo-carbono-consolidando-o-modelo-de-energia-renovavel',NULL,'NON_STARTED',20,1,1,NULL,'2014-06-08 21:51:39'),(152,'Considerar critérios ambientais nas políticas industrial, fiscal e de crédito.',NULL,'considerar-criterios-ambientais-nas-politicas-industrial-fiscal-e-de-credito',NULL,'NON_STARTED',20,1,1,NULL,'2014-06-08 21:51:39'),(153,'Reduzir as invasões no campo.',NULL,'reduzir-as-invasoes-no-campo',NULL,'NON_STARTED',21,1,1,NULL,'2014-06-08 21:51:39'),(154,'Não compactuar com invasões de prédios públicos e propriedades, mas não reprimir manifestações de sem-terra quando forem simples reivindicações.',NULL,'nao-compactuar-com-invasoes-de-predios-publicos-e-propriedades-mas-nao-reprimir-manifestacoes-de-sem-terra-quando-forem-simples-reivindicacoes',NULL,'NON_STARTED',21,1,1,NULL,'2014-06-08 21:51:39'),(155,'Intensificar e aprimorar a reforma agrária para dar centralidade à estratégia de desenvolvimento sustentável, com a garantia do cumprimento integral da função social da propriedade.',NULL,'intensificar-e-aprimorar-a-reforma-agraria-para-dar-centralidade-a-estrategia-de-desenvolvimento-sustentavel-com-a-garantia-do-cumprimento-integral-da-funcao-social-da-propriedade',NULL,'NON_STARTED',21,1,1,NULL,'2014-06-08 21:51:39'),(156,'Ampliar o financiamento para o agronegócio e a agricultura familiar.',NULL,'ampliar-o-financiamento-para-o-agronegocio-e-a-agricultura-familiar',NULL,'NON_STARTED',21,1,1,NULL,'2014-06-08 21:51:39'),(157,'Assegurar crédito, assistência técnica e mercado aos pequenos produtores. Ampliar o programa de compra direta de alimentos do agricultor familiar, passando de 700 mil para 1,2 milhão de contemplados. Ao mesmo tempo, apoiar os grandes produtores, que contr',NULL,'assegurar-credito-assistencia-tecnica-e-mercado-aos-pequenos-produtores-ampliar-o-programa-de-compra-direta-de-alimentos-do-agricultor-familiar-passando-de-700-mil-para-12-milhao-de-contemplados-ao-mesmo-tempo-apoiar-os-grandes-produtores-que-contr',NULL,'NON_STARTED',21,1,1,NULL,'2014-06-08 21:51:39'),(158,'Incluir dois milhões de famílias de pequenos agricultores e assentados no Programa Nacional de Fortalecimento da Agricultura Familiar (Pronaf).',NULL,'incluir-dois-milhoes-de-familias-de-pequenos-agricultores-e-assentados-no-programa-nacional-de-fortalecimento-da-agricultura-familiar-(pronaf)',NULL,'NON_STARTED',21,1,1,NULL,'2014-06-08 21:51:39'),(159,'Dar mais apoio científico e tecnológico a organismos como a Embrapa.',NULL,'dar-mais-apoio-cientifico-e-tecnologico-a-organismos-como-a-embrapa',NULL,'NON_STARTED',21,1,1,NULL,'2014-06-08 21:51:39'),(160,'Fazer 54 obras para melhorar os indicadores de saúde das comunidades ribeirinhas da Região Norte.',NULL,'fazer-54-obras-para-melhorar-os-indicadores-de-saude-das-comunidades-ribeirinhas-da-regiao-norte',NULL,'NON_STARTED',22,1,1,NULL,'2014-06-08 21:51:39'),(161,'Construir sistemas de irrigação no Sul, no Sudeste e no Centro-Oeste.',NULL,'construir-sistemas-de-irrigacao-no-sul-no-sudeste-e-no-centro-oeste',NULL,'NON_STARTED',22,1,1,NULL,'2014-06-08 21:51:40'),(162,'Continuar a transposição das águas do Rio São Francisco.',NULL,'continuar-a-transposicao-das-aguas-do-rio-sao-francisco',NULL,'NON_STARTED',22,1,1,NULL,'2014-06-08 21:51:40'),(163,'Não mandar ao Congresso ou sancionar qualquer legislação que impacte a religião, como legalização do aborto e casamento homossexual. ',NULL,'nao-mandar-ao-congresso-ou-sancionar-qualquer-legislacao-que-impacte-a-religiao-como-legalizacao-do-aborto-e-casamento-homossexual',NULL,'NON_STARTED',23,1,1,NULL,'2014-06-08 21:51:40'),(164,'Tratar o aborto como questão de saúde pública, atendendo às mulheres que tenham abortado e enfrentem risco de morrer.',NULL,'tratar-o-aborto-como-questao-de-saude-publica-atendendo-as-mulheres-que-tenham-abortado-e-enfrentem-risco-de-morrer',NULL,'NON_STARTED',23,1,1,NULL,'2014-06-08 21:51:40'),(165,'Sancionar o projeto de lei complementar 122 (que criminaliza a homofobia) apenas nos artigos que não violem a liberdade de crença, de culto e de expressão e as demais garantias constitucionais individuais.',NULL,'sancionar-o-projeto-de-lei-complementar-122-(que-criminaliza-a-homofobia)-apenas-nos-artigos-que-nao-violem-a-liberdade-de-crenca-de-culto-e-de-expressao-e-as-demais-garantias-constitucionais-individuais',NULL,'NON_STARTED',23,1,1,NULL,'2014-06-08 21:51:40'),(166,'Fazer da família o foco principal de seu governo.',NULL,'fazer-da-familia-o-foco-principal-de-seu-governo',NULL,'NON_STARTED',23,1,1,NULL,'2014-06-08 21:51:40'),(167,'Não promover iniciativas que afrontem a família.',NULL,'nao-promover-iniciativas-que-afrontem-a-familia',NULL,'NON_STARTED',23,1,1,NULL,'2014-06-08 21:51:40'),(168,'Fazer leis e programas que tenham a família como foco.',NULL,'fazer-leis-e-programas-que-tenham-a-familia-como-foco',NULL,'NON_STARTED',23,1,1,NULL,'2014-06-08 21:51:40'),(169,'Defender a convivência entre as diferentes religiões.',NULL,'defender-a-convivencia-entre-as-diferentes-religioes',NULL,'NON_STARTED',23,1,1,NULL,'2014-06-08 21:51:40'),(170,'Manter diálogo com as igrejas.',NULL,'manter-dialogo-com-as-igrejas',NULL,'NON_STARTED',23,1,1,NULL,'2014-06-08 21:51:40'),(171,'Fortalecer o Sistema Nacional de Cultura.',NULL,'fortalecer-o-sistema-nacional-de-cultura',NULL,'NON_STARTED',24,1,1,NULL,'2014-06-08 21:51:40'),(172,'Ampliar a produção e o consumo de bens culturais com base na diversidade brasileira.',NULL,'ampliar-a-producao-e-o-consumo-de-bens-culturais-com-base-na-diversidade-brasileira',NULL,'NON_STARTED',24,1,1,NULL,'2014-06-08 21:51:40'),(173,'Dar meios e oportunidades à criatividade popular.',NULL,'dar-meios-e-oportunidades-a-criatividade-popular',NULL,'NON_STARTED',24,1,1,NULL,'2014-06-08 21:51:40'),(174,'Ampliar os pontos de cultura e outros equipamentos.',NULL,'ampliar-os-pontos-de-cultura-e-outros-equipamentos',NULL,'NON_STARTED',24,1,1,NULL,'2014-06-08 21:51:40'),(175,'Implantar o Vale Cultura.',NULL,'implantar-o-vale-cultura',NULL,'NON_STARTED',24,1,1,NULL,'2014-06-08 21:51:40'),(176,'Fortalecer a indústria do audiovisual nacional e regional em articulação com outros países, sobretudo do Sul.',NULL,'fortalecer-a-industria-do-audiovisual-nacional-e-regional-em-articulacao-com-outros-paises-sobretudo-do-sul',NULL,'NON_STARTED',24,1,1,NULL,'2014-06-08 21:51:40'),(177,'Aperfeiçoar os mecanismos de financiamento da cultura.',NULL,'aperfeicoar-os-mecanismos-de-financiamento-da-cultura',NULL,'NON_STARTED',24,1,1,NULL,'2014-06-08 21:51:40'),(178,'Fortalecer a presença cultural do Brasil no mundo e promover o diálogo com outras culturas.',NULL,'fortalecer-a-presenca-cultural-do-brasil-no-mundo-e-promover-o-dialogo-com-outras-culturas',NULL,'NON_STARTED',24,1,1,NULL,'2014-06-08 21:51:40'),(179,'Não censurar conteúdo e rejeitar qualquer tentativa de controlar a mídia.',NULL,'nao-censurar-conteudo-e-rejeitar-qualquer-tentativa-de-controlar-a-midia',NULL,'NON_STARTED',25,1,1,NULL,'2014-06-08 21:51:41'),(180,'Dar garantia irrestrita da liberdade de imprensa, de expressão e de religião.',NULL,'dar-garantia-irrestrita-da-liberdade-de-imprensa-de-expressao-e-de-religiao',NULL,'NON_STARTED',25,1,1,NULL,'2014-06-08 21:51:41'),(181,'Expandir e fortalecer a democracia política, econômica e social.',NULL,'expandir-e-fortalecer-a-democracia-politica-economica-e-social',NULL,'NON_STARTED',25,1,1,NULL,'2014-06-08 21:51:41'),(182,'Fortalecer as redes públicas de comunicação e estimular o uso intensivo da blogosfera.',NULL,'fortalecer-as-redes-publicas-de-comunicacao-e-estimular-o-uso-intensivo-da-blogosfera',NULL,'NON_STARTED',25,1,1,NULL,'2014-06-08 21:51:41'),(183,'Ampliar o acesso aos meios de informação e comunicação por meio de internet, TV aberta e novas tecnologias.',NULL,'ampliar-o-acesso-aos-meios-de-informacao-e-comunicacao-por-meio-de-internet-tv-aberta-e-novas-tecnologias',NULL,'NON_STARTED',25,1,1,NULL,'2014-06-08 21:51:41'),(184,'Ampliar a presença internacional do Brasil, defendendo a paz, a redução de armamentos e uma ordem econômica e política mais justa.',NULL,'ampliar-a-presenca-internacional-do-brasil-defendendo-a-paz-a-reducao-de-armamentos-e-uma-ordem-economica-e-politica-mais-justa',NULL,'NON_STARTED',26,1,1,NULL,'2014-06-08 21:51:41'),(185,'Permanecer fiel aos princípios de não intervenção e direitos humanos.',NULL,'permanecer-fiel-aos-principios-de-nao-intervencao-e-direitos-humanos',NULL,'NON_STARTED',26,1,1,NULL,'2014-06-08 21:51:41'),(186,'Defender a democratização de organismos multilaterais como a ONU, o FMI e o Banco Mundial.',NULL,'defender-a-democratizacao-de-organismos-multilaterais-como-a-onu-o-fmi-e-o-banco-mundial',NULL,'NON_STARTED',26,1,1,NULL,'2014-06-08 21:51:41'),(187,'Manter a política de Lula, com diversificação de parceiros comerciais.',NULL,'manter-a-politica-de-lula-com-diversificacao-de-parceiros-comerciais',NULL,'NON_STARTED',26,1,1,NULL,'2014-06-08 21:51:41'),(188,'Manter olhar especial para a África.',NULL,'manter-olhar-especial-para-a-africa',NULL,'NON_STARTED',26,1,1,NULL,'2014-06-08 21:51:41'),(189,'Continuar a integração sul-americana e latino-americana e a cooperação Sul-Sul.',NULL,'continuar-a-integracao-sul-americana-e-latino-americana-e-a-cooperacao-sul-sul',NULL,'NON_STARTED',26,1,1,NULL,'2014-06-08 21:51:41'),(190,'Prestar solidariedade aos países pobres e em desenvolvimento.',NULL,'prestar-solidariedade-aos-paises-pobres-e-em-desenvolvimento',NULL,'NON_STARTED',26,1,1,NULL,'2014-06-08 21:51:41');
/*!40000 ALTER TABLE `promise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promise_category`
--

DROP TABLE IF EXISTS `promise_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promise_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_promise_category_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promise_category`
--

LOCK TABLES `promise_category` WRITE;
/*!40000 ALTER TABLE `promise_category` DISABLE KEYS */;
INSERT INTO `promise_category` VALUES (1,'Saúde','saude'),(2,'Programas Sociais e de Inclusão','programas-sociais-e-inclusao'),(3,'Educação e Qualificação','educacao-e-qualificacao'),(4,'Ciência e Tecnologia','ciencia-e-tecnologia'),(5,'Esporte e Lazer','esporte-e-lazer'),(6,'Copa e Olimpíadas','copa-e-olimpiadas'),(7,'Habitação','habitacao'),(8,'Urbanização','urbanizacao'),(9,'Segurança e Defesa','seguranca-e-defesa'),(10,'Transporte e Infraestrutura','transporte-e-infraestrutura'),(11,'Emprego e Renda','emprego-e-renda'),(12,'Impostos','impostos'),(13,'Administração','administracao'),(14,'Contas Públicas','contas-publicas'),(15,'Macroeconomia e Finanças','macroeconomia-e-financas'),(16,'Indústria','industria'),(17,'Pequenas Empresas','pequenas-empresas'),(18,'Petróleo','petroleo'),(19,'Outras Fontes de Energia','outras-fontes-de-energia'),(20,'Meio Ambiente','meio-ambiente'),(21,'Reforma Agrária e Agricultura','reforma-agraria-e-agricultura'),(22,'Irrigação','irrigacao'),(23,'Família e Religião','familia-e-religiao'),(24,'Cultura','cultura'),(25,'Mídia e Livre Expressão','midia-e-livre-expressao'),(26,'Política Externa','politica-externa');
/*!40000 ALTER TABLE `promise_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promise_evidence`
--

DROP TABLE IF EXISTS `promise_evidence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promise_evidence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `host` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `promise_id` int(11) NOT NULL,
  `registered_by_user_id` int(11) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_promise_evidence_promise` (`promise_id`),
  KEY `fk_promise_evidence_registered_by_user` (`registered_by_user_id`),
  CONSTRAINT `fk_promise_evidence_promise` FOREIGN KEY (`promise_id`) REFERENCES `promise` (`id`),
  CONSTRAINT `fk_promise_evidence_registered_by_user` FOREIGN KEY (`registered_by_user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promise_evidence`
--

LOCK TABLES `promise_evidence` WRITE;
/*!40000 ALTER TABLE `promise_evidence` DISABLE KEYS */;
/*!40000 ALTER TABLE `promise_evidence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promise_user_comment`
--

DROP TABLE IF EXISTS `promise_user_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promise_user_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `promise_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `registration_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_promise_user_comment_promise` (`promise_id`),
  KEY `fk_promise_user_comment_user` (`user_id`),
  CONSTRAINT `fk_promise_user_comment_promise` FOREIGN KEY (`promise_id`) REFERENCES `promise` (`id`),
  CONSTRAINT `fk_promise_user_comment_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promise_user_comment`
--

LOCK TABLES `promise_user_comment` WRITE;
/*!40000 ALTER TABLE `promise_user_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `promise_user_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promise_user_vote`
--

DROP TABLE IF EXISTS `promise_user_vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promise_user_vote` (
  `promise_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`promise_id`,`user_id`),
  KEY `fk_promise_user_vote_promise` (`promise_id`),
  KEY `fk_promise_user_vote_user` (`user_id`),
  CONSTRAINT `fk_promise_user_vote_promise` FOREIGN KEY (`promise_id`) REFERENCES `promise` (`id`),
  CONSTRAINT `fk_promise_user_vote_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promise_user_vote`
--

LOCK TABLES `promise_user_vote` WRITE;
/*!40000 ALTER TABLE `promise_user_vote` DISABLE KEYS */;
/*!40000 ALTER TABLE `promise_user_vote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `state` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `uf` varchar(20) NOT NULL,
  `preposition` varchar(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state`
--

LOCK TABLES `state` WRITE;
/*!40000 ALTER TABLE `state` DISABLE KEYS */;
INSERT INTO `state` VALUES (11,'Rondônia','RO','em'),(12,'Acre','AC','no'),(13,'Amazonas','AM','no'),(14,'Roraima','RR','em'),(15,'Pará','PA','no'),(16,'Amapá','AP','no'),(17,'Tocantis','TO','em'),(21,'Maranhão','MA','no'),(22,'Piauí','PI','no'),(23,'Ceará','CE','no'),(24,'Rio Grande do Norte','RN','no'),(25,'Paraíba','PB','na'),(26,'Pernambuco','PE','em'),(27,'Alagoas','AL','em'),(28,'Sergipe','SE','em'),(29,'Bahia','BA','na'),(31,'Minas Gerais','MG','em'),(32,'Espírito Santo','ES','no'),(33,'Rio de Janeiro','RJ','no'),(35,'São Paulo','SP','em'),(41,'Paraná','PR','no'),(42,'Santa Catarina','SC','em'),(43,'Rio Grande do Sul','RS','no'),(50,'Mato Grosso do Sul','MS','em'),(51,'Mato Grosso','MT','em'),(52,'Goiás','GO','em'),(53,'Distrito Federal','DF','no');
/*!40000 ALTER TABLE `state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `gender` enum('MALE','FEMALE') DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `photo_filename` varchar(255) DEFAULT NULL,
  `facebook_account` varchar(255) DEFAULT NULL,
  `twitter_account` varchar(255) DEFAULT NULL,
  `google_account` varchar(255) DEFAULT NULL,
  `registration_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_username` (`username`),
  UNIQUE KEY `uq_user_email` (`email`),
  UNIQUE KEY `uq_user_facebook_account` (`facebook_account`),
  UNIQUE KEY `uq_user_twitter_account` (`twitter_account`),
  UNIQUE KEY `uq_user_google_account` (`google_account`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Sandro Simas','MALE','sandro.csimas','sandro.csimas@gmail.com',NULL,'654264634643651',NULL,NULL,'2014-04-27 14:19:10');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-06-09 22:51:02
