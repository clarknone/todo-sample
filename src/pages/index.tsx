"use client";

import { ITodo } from "@/interface/todo";
import { TodoStorageManager } from "@/services/todo";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";

const todoManager = new TodoStorageManager();

export default function Home() {
  const [todos, setTodos] = useState<ITodo[]>(todoManager.getLocalTodo());
  const [editing, setEditing] = useState<null | number>(null);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    todoManager.updateStorage(todos);
  }, [todos]);

  function addNewItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = e.currentTarget["text"].value;
    const data: ITodo = { title, isCompleted: false, id: Math.random() };
    setTodos((val) => [...val, data]);
    e.currentTarget.reset();
  }

  function deleteItem(id: number): void {
    const index = getIndexFromId(id);
    setTodos((val) => {
      val.splice(index, 1);
      return [...val];
    });
  }

  function setEditingIndex(index: number): void {
    setEditing(index);
  }

  function updateItem(value: string, id: number): void {
    const index = getIndexFromId(id);
    setTodos((val) => {
      val[index].title = value;
      console.log({ value });
      return [...val];
    });
    setEditing(null);
  }

  function searchItem(event: ChangeEvent<HTMLInputElement>) {
    setSearchText(event.currentTarget.value);
  }

  function getIndexFromId(id: number) {
    return todos.findIndex((item) => item.id == id);
  }

  const displayItems: ITodo[] = todos.filter((todo) => todo.title.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <>
      <Head>
        <title>Sample Todo</title>
        <meta name="description" content="Sample Todo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth={false} disableGutters>
        <AppBar elevation={0} position="relative">
          <Toolbar>
            <Typography variant="h6"> Sample Todo </Typography>
          </Toolbar>
        </AppBar>
        <Stack mt={"2em"} gap={"1em"} p={"0.5em"} maxWidth={"600px"} mx={"auto"}>
          <form onSubmit={addNewItem}>
            <Stack alignItems={"center"} gap={"0.5em"} direction={"row"}>
              <TextField size="small" fullWidth required name="text" placeholder="Add New Item" />
              <Box>
                <Button disableElevation variant="contained" type="submit" startIcon={<FaPlus />}>
                  Add
                </Button>
              </Box>
            </Stack>
          </form>

          <TextField size="small" placeholder="Search" fullWidth onChange={searchItem} />

          {displayItems.length ? (
            <List>
              {displayItems.map((item, index) => (
                <>
                  {editing == index ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateItem(e.currentTarget["text"].value, item.id);
                      }}
                    >
                      <TextField
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              onClick={(e) => {
                                setEditing(null);
                              }}
                            >
                              <FaTimes fontSize={"0.6em"} />
                            </IconButton>
                          ),
                        }}
                        size="small"
                        fullWidth
                        defaultValue={item.title}
                        name="text"
                      />
                    </form>
                  ) : (
                    <ListItem
                      onClick={() => setEditingIndex(index)}
                      key={item.id}
                      secondaryAction={
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.id);
                          }}
                        >
                          <FaTrash color="rgba(255,0,0,0.5)" fontSize={"0.7em"} />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={item.title} />
                    </ListItem>
                  )}
                  {<Divider />}
                </>
              ))}
            </List>
          ) : (
            <Typography textAlign={"center"} style={{ opacity: "0.4" }}>
              {" "}
              No Item Available
            </Typography>
          )}
        </Stack>
      </Container>
    </>
  );
}
