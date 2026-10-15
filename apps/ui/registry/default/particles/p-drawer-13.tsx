"use client";

import {
  CopyIcon,
  EllipsisIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import { useMediaQuery } from "@/registry/default/hooks/use-media-query";
import { Button } from "@/registry/default/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerMenu,
  DrawerMenuCheckboxItem,
  DrawerMenuGroup,
  DrawerMenuGroupLabel,
  DrawerMenuItem,
  DrawerMenuRadioGroup,
  DrawerMenuRadioItem,
  DrawerMenuSeparator,
  DrawerMenuTrigger,
  DrawerPanel,
  DrawerPopup,
  DrawerTrigger,
} from "@/registry/default/ui/drawer";
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from "@/registry/default/ui/menu";

const TRIGGER_ARIA_LABEL = "Open menu";

export default function Particle() {
  const isMobile = useMediaQuery("max-md");

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger
          render={
            <Button
              aria-label={TRIGGER_ARIA_LABEL}
              size="icon"
              variant="outline"
            />
          }
        >
          <EllipsisIcon aria-hidden />
        </DrawerTrigger>
        <DrawerPopup aria-label="Actions" showBar>
          <DrawerPanel>
            <DrawerMenu>
              <DrawerMenuGroup>
                <DrawerMenuGroupLabel>Actions</DrawerMenuGroupLabel>
                <DrawerClose render={<DrawerMenuItem />}>
                  <PencilIcon aria-hidden />
                  Edit
                </DrawerClose>
                <DrawerClose render={<DrawerMenuItem />}>
                  <CopyIcon aria-hidden />
                  Duplicate
                </DrawerClose>
                <DrawerClose render={<DrawerMenuItem />}>
                  <ShareIcon aria-hidden />
                  Share
                </DrawerClose>
              </DrawerMenuGroup>
              <DrawerMenuSeparator />
              <DrawerMenuCheckboxItem>Shuffle</DrawerMenuCheckboxItem>
              <DrawerMenuCheckboxItem>Repeat</DrawerMenuCheckboxItem>
              <DrawerMenuCheckboxItem disabled>
                Enhanced Audio
              </DrawerMenuCheckboxItem>
              <DrawerMenuSeparator />
              <DrawerMenuGroup>
                <DrawerMenuGroupLabel>Sort by</DrawerMenuGroupLabel>
                <DrawerMenuRadioGroup defaultValue="artist">
                  <DrawerMenuRadioItem value="artist">
                    Artist
                  </DrawerMenuRadioItem>
                  <DrawerMenuRadioItem value="album">Album</DrawerMenuRadioItem>
                  <DrawerMenuRadioItem value="title">Title</DrawerMenuRadioItem>
                </DrawerMenuRadioGroup>
              </DrawerMenuGroup>
              <DrawerMenuSeparator />
              <DrawerMenuCheckboxItem variant="switch">
                Auto save
              </DrawerMenuCheckboxItem>
              <DrawerMenuSeparator />
              <Drawer>
                <DrawerMenuTrigger>Add to Playlist</DrawerMenuTrigger>
                <DrawerPopup aria-label="Add to Playlist" showBar>
                  <DrawerPanel>
                    <DrawerMenu>
                      <DrawerMenuGroup>
                        <DrawerMenuGroupLabel>
                          Add to Playlist
                        </DrawerMenuGroupLabel>
                      </DrawerMenuGroup>
                      <DrawerClose render={<DrawerMenuItem />}>
                        Jazz
                      </DrawerClose>
                      <Drawer>
                        <DrawerMenuTrigger>Rock</DrawerMenuTrigger>
                        <DrawerPopup aria-label="Rock" showBar>
                          <DrawerPanel>
                            <DrawerMenu>
                              <DrawerMenuGroup>
                                <DrawerMenuGroupLabel>
                                  Rock
                                </DrawerMenuGroupLabel>
                              </DrawerMenuGroup>
                              <DrawerClose render={<DrawerMenuItem />}>
                                Hard Rock
                              </DrawerClose>
                              <DrawerClose render={<DrawerMenuItem />}>
                                Soft Rock
                              </DrawerClose>
                              <DrawerClose render={<DrawerMenuItem />}>
                                Classic Rock
                              </DrawerClose>
                              <DrawerMenuSeparator />
                              <DrawerClose render={<DrawerMenuItem />}>
                                Metal
                              </DrawerClose>
                              <DrawerClose render={<DrawerMenuItem />}>
                                Punk
                              </DrawerClose>
                              <DrawerClose render={<DrawerMenuItem />}>
                                Grunge
                              </DrawerClose>
                              <DrawerClose render={<DrawerMenuItem />}>
                                Alternative
                              </DrawerClose>
                              <DrawerClose render={<DrawerMenuItem />}>
                                Indie
                              </DrawerClose>
                              <DrawerClose render={<DrawerMenuItem />}>
                                Electronic
                              </DrawerClose>
                            </DrawerMenu>
                          </DrawerPanel>
                        </DrawerPopup>
                      </Drawer>
                      <DrawerClose render={<DrawerMenuItem />}>Pop</DrawerClose>
                    </DrawerMenu>
                  </DrawerPanel>
                </DrawerPopup>
              </Drawer>
              <DrawerMenuSeparator />
              <DrawerMenuGroup>
                <DrawerMenuGroupLabel>Danger zone</DrawerMenuGroupLabel>
                <DrawerClose render={<DrawerMenuItem variant="destructive" />}>
                  <TrashIcon aria-hidden />
                  Delete
                </DrawerClose>
              </DrawerMenuGroup>
            </DrawerMenu>
          </DrawerPanel>
        </DrawerPopup>
      </Drawer>
    );
  }

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            aria-label={TRIGGER_ARIA_LABEL}
            size="icon"
            variant="outline"
          />
        }
      >
        <EllipsisIcon aria-hidden />
      </MenuTrigger>
      <MenuPopup>
        <MenuGroup>
          <MenuGroupLabel>Actions</MenuGroupLabel>
          <MenuItem>
            <PencilIcon aria-hidden />
            Edit
          </MenuItem>
          <MenuItem>
            <CopyIcon aria-hidden />
            Duplicate
          </MenuItem>
          <MenuItem>
            <ShareIcon aria-hidden />
            Share
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckboxItem>Shuffle</MenuCheckboxItem>
        <MenuCheckboxItem>Repeat</MenuCheckboxItem>
        <MenuCheckboxItem disabled>Enhanced Audio</MenuCheckboxItem>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Sort by</MenuGroupLabel>
          <MenuRadioGroup defaultValue="artist">
            <MenuRadioItem value="artist">Artist</MenuRadioItem>
            <MenuRadioItem value="album">Album</MenuRadioItem>
            <MenuRadioItem value="title">Title</MenuRadioItem>
          </MenuRadioGroup>
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckboxItem variant="switch">Auto save</MenuCheckboxItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>Add to Playlist</MenuSubTrigger>
          <MenuSubPopup>
            <MenuItem>Jazz</MenuItem>
            <MenuSub>
              <MenuSubTrigger>Rock</MenuSubTrigger>
              <MenuSubPopup>
                <MenuItem>Hard Rock</MenuItem>
                <MenuItem>Soft Rock</MenuItem>
                <MenuItem>Classic Rock</MenuItem>
                <MenuSeparator />
                <MenuItem>Metal</MenuItem>
                <MenuItem>Punk</MenuItem>
                <MenuItem>Grunge</MenuItem>
                <MenuItem>Alternative</MenuItem>
                <MenuItem>Indie</MenuItem>
                <MenuItem>Electronic</MenuItem>
              </MenuSubPopup>
            </MenuSub>
            <MenuItem>Pop</MenuItem>
          </MenuSubPopup>
        </MenuSub>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Danger zone</MenuGroupLabel>
          <MenuItem variant="destructive">
            <TrashIcon aria-hidden />
            Delete
          </MenuItem>
        </MenuGroup>
      </MenuPopup>
    </Menu>
  );
}
