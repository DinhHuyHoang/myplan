-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 25, 2018 at 06:04 PM
-- Server version: 10.1.34-MariaDB
-- PHP Version: 7.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `myplan`
--

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE `note` (
  `id` int(11) NOT NULL,
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `priority` tinyint(3) NOT NULL COMMENT '1:low 2:medium 3:high',
  `estimate` int(11) NOT NULL COMMENT 'hours',
  `working` int(11) DEFAULT '0' COMMENT 'hours',
  `finished` tinyint(1) DEFAULT '0' COMMENT '1:true 0:false',
  `for_date` date DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1' COMMENT '0: isDeleted, 1:isCreated',
  `created` date NOT NULL,
  `updated` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `note`
--

INSERT INTO `note` (`id`, `title`, `description`, `priority`, `estimate`, `working`, `finished`, `for_date`, `status`, `created`, `updated`) VALUES
(1, 'Đi chơi lúc 9h', 'đi chơi với bạn', 3, 2, 1, 1, '2018-10-25', 1, '2018-10-25', '2018-10-25'),
(2, 'Ghi chú 2', 'Học tiếp nha', 1, 1, 0, 1, '2018-10-26', 1, '2018-10-25', '2018-10-25'),
(3, 'Đi chơi lúc 9h', 'đi chơi với bạn', 1, 1, 1, 1, '2018-10-26', 1, '2018-10-25', '2018-10-25'),
(4, 'Ghi chú 3', 'Đi chơi bar', 2, 1, 0, 1, '2018-10-27', 1, '2018-10-25', '2018-10-25'),
(5, 'Ghi chú 4', '4', 1, 4, 0, 1, '2018-10-25', 1, '2018-10-25', '2018-10-25'),
(6, 'Ghi chú 5', '5', 1, 5, 0, 1, '2018-10-27', 1, '2018-10-25', '2018-10-25'),
(7, 'Ghi chú 6', '6', 1, 6, 0, 1, '2018-10-23', 1, '2018-10-25', '2018-10-25'),
(8, 'Ghi chú 7', '7', 3, 12, 3, 0, '2018-10-24', 1, '2018-10-25', '2018-10-25');

-- --------------------------------------------------------

--
-- Table structure for table `note_tag`
--

CREATE TABLE `note_tag` (
  `id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `note_tag`
--

INSERT INTO `note_tag` (`id`, `note_id`, `tag_id`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 3),
(4, 4, 2),
(5, 5, 1),
(6, 6, 2),
(7, 7, 3),
(8, 8, 1),
(9, 8, 2),
(10, 8, 3);

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '0:deleted 1:created',
  `created` date NOT NULL,
  `updated` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tag`
--

INSERT INTO `tag` (`id`, `name`, `description`, `status`, `created`, `updated`) VALUES
(1, 'Học tập', '', 1, '2018-10-25', '2018-10-25'),
(2, 'Giải trí', '', 1, '2018-10-25', NULL),
(3, 'Đi chơi', '', 1, '2018-10-25', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `note`
--
ALTER TABLE `note`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `note_tag`
--
ALTER TABLE `note_tag`
  ADD PRIMARY KEY (`id`,`note_id`,`tag_id`) USING BTREE,
  ADD KEY `FK_note_tag` (`note_id`),
  ADD KEY `FK_tag_note` (`tag_id`);

--
-- Indexes for table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `note`
--
ALTER TABLE `note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `note_tag`
--
ALTER TABLE `note_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `note_tag`
--
ALTER TABLE `note_tag`
  ADD CONSTRAINT `FK_note_tag` FOREIGN KEY (`note_id`) REFERENCES `note` (`id`),
  ADD CONSTRAINT `FK_tag_note` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
