import {
  Box,
  LinkBox,
  LinkOverlay,
  ScaleFade,
  Text,
  Icon,
  Flex,
  HStack,
  useBreakpointValue,
  Checkbox,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IContext, FileProps } from "../../context";
import { formatDate } from "../../../../utils/date";
import { getFileSize } from "../../../../utils/file";
import getIcon from "../../../../utils/icon";
import useDownLink from "../../../../hooks/useDownLink";
import { useEncrypt } from "../../../../hooks/useEncrypt";
import { useContextMenu } from "react-contexify";
import { MENU_ID } from "./list";

const ListItem = ({ file }: FileProps) => {
  const { pathname } = useLocation();
  const { getSetting, multiSelect } = useContext(IContext);
  const [cursor, setCursor] = useState<boolean>(false);
  // const isShow = useBreakpointValue({ base: false, md: true });
  const [cursorIcon, setCursorIcon] = useState<boolean>(false);
  const ItemBox = getSetting("animation") === "true" ? ScaleFade : Box;
  const MyLinkBox = cursor ? Box : LinkBox;
  const checkboxBorderColor = useColorModeValue("gray.300", "gray.500");
  const { show } = useContextMenu({
    id: MENU_ID,
    props: file,
  });
  const props =
    getSetting("animation") === "true"
      ? {
          initialScale: 0.9,
          in: true,
        }
      : {};
  return (
    <ItemBox style={{ width: "100%" }} {...props}>
      <MyLinkBox
        className="list-item"
        p="2"
        w="full"
        rounded="lg"
        transition="all 0.3s"
        _hover={{
          transform: "scale(1.01)",
          bgColor: "rgba(132,133,141,0.18)",
        }}
        onMouseOver={() => setCursor(true)}
        onMouseLeave={() => setCursor(false)}
        onContextMenu={(e) => {
          show(e);
        }}
      >
        <LinkOverlay
          as={cursorIcon ? Box : Link}
          to={encodeURI(
            `${pathname.endsWith("/") ? pathname.slice(0, -1) : pathname}/${
              file.name
            }`
          )}
        >
          <HStack spacing={2}>
            <Flex
              className="list-item-name"
              align="center"
              w={{ base: 3 / 4, md: "50%" }}
            >
              {multiSelect && (
                <Checkbox
                  onMouseOver={() => setCursorIcon(true)}
                  onMouseLeave={() => setCursorIcon(false)}
                  mr={2}
                  borderColor={checkboxBorderColor}
                />
              )}
              <Icon
                color={getSetting("icon color")}
                boxSize={6}
                as={getIcon(file.type, file.name.split(".").pop() || "")}
                mr={2}
              />
              <Text
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                fontSize="md"
              >
                {file.name}
              </Text>
            </Flex>
            <Text
              className="list-item-size"
              w={{ base: 1 / 4, md: 1 / 6 }}
              textAlign="right"
            >
              {file.size_str ? file.size_str : getFileSize(file.size)}
            </Text>
            <Text
              className="list-item-updated_at"
              w={{ base: 0, md: 1 / 3 }}
              display={{ base: "none", md: "unset" }}
              textAlign="right"
            >
              {file.time_str
                ? file.time_str
                : file.driver === "Lanzou"
                ? "-"
                : formatDate(file.updated_at)}
            </Text>
          </HStack>
        </LinkOverlay>
      </MyLinkBox>
    </ItemBox>
  );
};

export default ListItem;
