/*
Navicat MySQL Data Transfer

Source Server         : test
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : tools

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2017-12-13 14:55:43
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `filemsg`
-- ----------------------------
DROP TABLE IF EXISTS `filemsg`;
CREATE TABLE `filemsg` (
  `id` bigint(16) NOT NULL AUTO_INCREMENT,
  `fileName` varchar(100) NOT NULL,
  `fileSize` bigint(100) DEFAULT NULL,
  `type` tinyint(1) unsigned zerofill DEFAULT '0' COMMENT '0:手动上传 1:爬虫爬取',
  `Mdate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of filemsg
-- ----------------------------
INSERT INTO `filemsg` VALUES ('1', '1.txt', '10', '0', '2017-11-09 11:49:20');
INSERT INTO `filemsg` VALUES ('2', '01.jpg', '15719', '0', '2017-12-04 11:26:08');
INSERT INTO `filemsg` VALUES ('3', '2.jpg', '13698', '0', '2017-12-07 15:33:53');
INSERT INTO `filemsg` VALUES ('4', '1513146956839_0.png', '1636', '1', '2017-12-13 14:37:06');
INSERT INTO `filemsg` VALUES ('5', '1513147049925_1.JPG', '93529', '1', '2017-12-13 14:38:54');
INSERT INTO `filemsg` VALUES ('6', '1513147133702_2.JPG', '85002', '1', '2017-12-13 14:38:57');
INSERT INTO `filemsg` VALUES ('7', '1513147137196_3.JPG', '106496', '1', '2017-12-13 14:38:58');
INSERT INTO `filemsg` VALUES ('8', '1513147137699_4.JPEG', '7919', '1', '2017-12-13 14:38:58');
INSERT INTO `filemsg` VALUES ('9', '1513147137769_5.JPG', '16874', '1', '2017-12-13 14:38:58');
INSERT INTO `filemsg` VALUES ('10', '1513147137969_6.png', '332', '1', '2017-12-13 14:38:58');

-- ----------------------------
-- Table structure for `t_module`
-- ----------------------------
DROP TABLE IF EXISTS `t_module`;
CREATE TABLE `t_module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_name` varchar(32) DEFAULT NULL,
  `module_path` varchar(50) DEFAULT NULL,
  `module_type` int(2) DEFAULT NULL COMMENT '1.URL, 2.鍔熻兘',
  `module_key` varchar(32) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_module
-- ----------------------------
INSERT INTO `t_module` VALUES ('1', 'Overview', '/index', '1', 'IndexUrl', '2016-06-01 23:41:39');
INSERT INTO `t_module` VALUES ('2', 'Reports', '/page/desktop/index', '1', 'Reports', '2016-06-02 09:42:17');
INSERT INTO `t_module` VALUES ('3', 'Analytics', '/page/common/timeline/jn-timeline', '1', 'Analytics', '2016-06-03 21:42:17');
INSERT INTO `t_module` VALUES ('4', 'Export', '/page/webUpload/uploadFile', '1', 'Export', '2016-06-03 20:38:01');
INSERT INTO `t_module` VALUES ('5', 'Nav item', '/Login.do', '1', 'Nav_item', '2016-06-03 20:38:04');
INSERT INTO `t_module` VALUES ('6', 'Nav item again', '/page/index', '1', 'Nav_item_again', '2016-06-03 20:38:08');
INSERT INTO `t_module` VALUES ('7', 'One more nav', '/', '1', 'One_more_nav', '2016-06-21 20:38:11');
INSERT INTO `t_module` VALUES ('8', 'Another nav item', '/WebUploadAction.do?method=getFileList', '1', 'Another_nav_item', '2016-05-29 20:38:23');
INSERT INTO `t_module` VALUES ('9', 'More navigation', '/timeline', '1', 'More_navigation', '2016-06-05 20:38:14');
INSERT INTO `t_module` VALUES ('10', 'Nav item again', '/uploadFile', '1', 'Nav_item_again1', '2016-07-01 20:38:28');
INSERT INTO `t_module` VALUES ('11', 'One more nav', '/icon/min/desktop', '1', 'One_more_nav1', '2016-05-31 20:38:18');
INSERT INTO `t_module` VALUES ('12', 'webupload batch', '/WebUploadAction.do?method=batchDownLoad', '1', 'Nav', '2017-12-07 15:11:17');
INSERT INTO `t_module` VALUES ('13', 'webupload', '/WebUploadAction.do?method=removeFile', '1', 'Nav', '2017-12-07 15:14:09');
INSERT INTO `t_module` VALUES ('14', 'webupload', '/WebUploadAction.do?method=saveFilemsg', '1', 'Nav', '2017-12-07 15:14:13');
INSERT INTO `t_module` VALUES ('15', 'webupload', '/WebUploadAction.do?method=getFile', '1', 'Nav', '2017-12-07 15:12:48');
INSERT INTO `t_module` VALUES ('16', 'logout', '/logout', '1', 'Nav', '2017-12-07 16:03:50');
INSERT INTO `t_module` VALUES ('17', 'Another nav item', '/WebUploadAction.do?method=upload', '1', 'Another_nav_item1', '2017-12-12 14:01:33');
INSERT INTO `t_module` VALUES ('18', 'Another nav item', '/spider', '1', 'Nav', '2017-12-12 14:08:13');
INSERT INTO `t_module` VALUES ('19', 'WebMagic', '/WebMagic.do?method=getSpiderList', '1', 'Another_nav_item1', '2017-12-13 10:48:21');
INSERT INTO `t_module` VALUES ('20', 'WebMagic', '/WebMagic.do?method=start', '1', 'Another_nav_item1', '2016-05-29 20:38:31');

-- ----------------------------
-- Table structure for `t_role`
-- ----------------------------
DROP TABLE IF EXISTS `t_role`;
CREATE TABLE `t_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(32) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_role
-- ----------------------------
INSERT INTO `t_role` VALUES ('1', '管理员', '系统管理员', '2016-06-01 23:41:11');

-- ----------------------------
-- Table structure for `t_role_module`
-- ----------------------------
DROP TABLE IF EXISTS `t_role_module`;
CREATE TABLE `t_role_module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) DEFAULT NULL,
  `module_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_role_module
-- ----------------------------
INSERT INTO `t_role_module` VALUES ('1', '1', '1');
INSERT INTO `t_role_module` VALUES ('2', '1', '2');
INSERT INTO `t_role_module` VALUES ('3', '1', '3');
INSERT INTO `t_role_module` VALUES ('4', '1', '4');
INSERT INTO `t_role_module` VALUES ('5', '1', '5');
INSERT INTO `t_role_module` VALUES ('6', '1', '6');
INSERT INTO `t_role_module` VALUES ('7', '1', '7');
INSERT INTO `t_role_module` VALUES ('8', '1', '8');
INSERT INTO `t_role_module` VALUES ('9', '1', '9');
INSERT INTO `t_role_module` VALUES ('10', '1', '10');
INSERT INTO `t_role_module` VALUES ('11', '1', '11');
INSERT INTO `t_role_module` VALUES ('12', '1', '12');
INSERT INTO `t_role_module` VALUES ('13', '1', '13');
INSERT INTO `t_role_module` VALUES ('14', '1', '14');
INSERT INTO `t_role_module` VALUES ('15', '1', '15');
INSERT INTO `t_role_module` VALUES ('16', '1', '16');
INSERT INTO `t_role_module` VALUES ('17', '1', '17');
INSERT INTO `t_role_module` VALUES ('18', '1', '18');
INSERT INTO `t_role_module` VALUES ('19', '1', '19');
INSERT INTO `t_role_module` VALUES ('20', '1', '20');

-- ----------------------------
-- Table structure for `t_user`
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(32) DEFAULT NULL,
  `password` varchar(32) DEFAULT NULL,
  `name` varchar(32) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES ('1', 'admin', 'e10adc3949ba59abbe56e057f20f883e', 'Admin', '2016-06-01 23:35:17');
INSERT INTO `t_user` VALUES ('2', 'lance', 'e10adc3949ba59abbe56e057f20f883e', 'Lance', '2016-06-02 23:35:38');

-- ----------------------------
-- Table structure for `t_user_role`
-- ----------------------------
DROP TABLE IF EXISTS `t_user_role`;
CREATE TABLE `t_user_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_user_role
-- ----------------------------
INSERT INTO `t_user_role` VALUES ('1', '1', '1');