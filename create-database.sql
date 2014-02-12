
DROP TABLE IF EXISTS `step`;
DROP TABLE IF EXISTS `solutions`;
DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `session` (
  `session_id` varchar(50) NOT NULL,
  `mode` varchar(20) NOT NULL,
  `user` varchar(30) NOT NULL,
  `section` varchar(30) NOT NULL,
  `problem` varchar(30) DEFAULT NULL,
  `author` varchar(30) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
CREATE TABLE `step` (
  `tid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` varchar(50) NOT NULL,
  `method` varchar(20) NOT NULL,
  `message` text,
  PRIMARY KEY (`tid`),
  KEY (`session_id`),
  CONSTRAINT `fk_session_id` FOREIGN KEY (`session_id`) REFERENCES `session` (`session_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
USE test;
--
-- Table structure for table `solutions`
--
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `solutions` (
  `session_id` varchar(50) NOT NULL,
  `share` BOOL NOT NULL DEFAULT 0, 
  `deleted` BOOL NOT NULL DEFAULT 0, 
  `solution_graph` TEXT DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  CONSTRAINT `fk_sesssion_id` FOREIGN KEY (`session_id`) REFERENCES `session` (`session_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;


--  the share and deleted bits are set here, rather than in the sessions table
--  since they are most naturally set during the autosave process.

