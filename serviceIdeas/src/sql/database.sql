CREATE TABLE `ideas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idea` varchar(200) NOT NULL,
  `proposername` varchar(100) NOT NULL,
  `votes` smallint(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8