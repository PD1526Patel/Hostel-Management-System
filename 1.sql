-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: hostel_management
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `complaintID` int NOT NULL AUTO_INCREMENT,
  `studentID` int DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text,
  `status` enum('New','Assigned','Resolved','Rejected') DEFAULT 'New',
  `dateFiled` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`complaintID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `complaints_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `students` (`studentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fees`
--

DROP TABLE IF EXISTS `fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fees` (
  `feeID` int NOT NULL AUTO_INCREMENT,
  `studentID` int DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `status` enum('Pending','Paid') DEFAULT 'Pending',
  PRIMARY KEY (`feeID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `fees_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `students` (`studentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fees`
--

LOCK TABLES `fees` WRITE;
/*!40000 ALTER TABLE `fees` DISABLE KEYS */;
/*!40000 ALTER TABLE `fees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hostels`
--

DROP TABLE IF EXISTS `hostels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hostels` (
  `hostelID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `totalRooms` int DEFAULT NULL,
  PRIMARY KEY (`hostelID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hostels`
--

LOCK TABLES `hostels` WRITE;
/*!40000 ALTER TABLE `hostels` DISABLE KEYS */;
INSERT INTO `hostels` VALUES (1,'Boys Hostel A','North Campus',50);
/*!40000 ALTER TABLE `hostels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `roomID` int NOT NULL AUTO_INCREMENT,
  `roomNo` varchar(10) NOT NULL,
  `hostelID` int DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `occupancy` int DEFAULT '0',
  `status` varchar(50) DEFAULT 'Available',
  PRIMARY KEY (`roomID`),
  KEY `hostelID` (`hostelID`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`hostelID`) REFERENCES `hostels` (`hostelID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'101',1,'Single',1,0,'Available'),(2,'102',1,'Double',2,0,'Available'),(3,'103',1,'Double',2,0,'Available'),(4,'104',1,'Triple',3,0,'Available');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `studentID` int NOT NULL,
  `rollNo` varchar(50) DEFAULT NULL,
  `course` varchar(100) DEFAULT NULL,
  `roomID` int DEFAULT NULL,
  `feesDue` float DEFAULT '0',
  PRIMARY KEY (`studentID`),
  UNIQUE KEY `rollNo` (`rollNo`),
  KEY `roomID` (`roomID`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`roomID`) REFERENCES `rooms` (`roomID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'112315080','B.Tech',NULL,0),(2,'1','B.Tech',NULL,0),(3,'0001','Admin',NULL,0),(4,'','',NULL,0);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('student','warden','admin') NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'prashil1526','$2b$10$7DbAkXyAZEusCb4HfC0qDemlimcpUdEg5szLjLOxETtugMOhsMpqK','Prashil',NULL,NULL,'student'),(2,'prashiltest123','$2b$10$mTSwepmLRo1VEF89KDUlnOv5esLzVJ1K9BerqHwCO/PIucI0ksSpO','Prashil_test',NULL,NULL,'student'),(3,'admin','$2b$10$XjpWJRjpNjW9EV.xDuw9dujS5ha1Anv3wD8Tcnh64v2Purevc7XRO','Admin',NULL,NULL,'admin'),(4,'','$2b$10$4JTi2gsSqrSYMaj8PRYBM.LZ.NzRByOI83H72lzdh2MB/869rUbkm','',NULL,NULL,'student');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitorlog`
--

DROP TABLE IF EXISTS `visitorlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitorlog` (
  `visitorID` int NOT NULL AUTO_INCREMENT,
  `studentID` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `inTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `outTime` datetime DEFAULT NULL,
  PRIMARY KEY (`visitorID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `visitorlog_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `students` (`studentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitorlog`
--

LOCK TABLES `visitorlog` WRITE;
/*!40000 ALTER TABLE `visitorlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `visitorlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wardens`
--

DROP TABLE IF EXISTS `wardens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wardens` (
  `wardenID` int NOT NULL,
  `hostelID` int DEFAULT NULL,
  PRIMARY KEY (`wardenID`),
  KEY `hostelID` (`hostelID`),
  CONSTRAINT `wardens_ibfk_1` FOREIGN KEY (`wardenID`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `wardens_ibfk_2` FOREIGN KEY (`hostelID`) REFERENCES `hostels` (`hostelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wardens`
--

LOCK TABLES `wardens` WRITE;
/*!40000 ALTER TABLE `wardens` DISABLE KEYS */;
/*!40000 ALTER TABLE `wardens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-01 15:29:32
