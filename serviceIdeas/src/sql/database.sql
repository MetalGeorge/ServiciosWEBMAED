CREATE TABLE `ideas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idea` varchar(200) NOT NULL,
  `proposername` varchar(100) NOT NULL,
  `votes` smallint(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8

CREATE TABLE `votes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `voterid` varchar(24) NOT NULL,
  `ideaid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8