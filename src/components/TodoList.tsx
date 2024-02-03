"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";
import { Button } from "@aws-amplify/ui-react";

// generate your data client using the Schema from your backend
const client = generateClient<Schema>();

export default function TodoList() {
  const [todos, setTodos] = useState<Schema["Todo"][]>([]);

  //   async function listTodos() {
  //     // fetch all todos
  //     const { data } = await client.models.Todo.list();
  //     setTodos(data);
  //   }

  //   useEffect(() => {
  //     listTodos();
  //   }, []);

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe(({ items }) =>
      setTodos([...items])
    );

    return () => sub.unsubscribe();
  }, []);

  return (
    <div>
      <h1>Todos</h1>
      <Button
        variation="primary"
        onClick={async () => {
          // create a new Todo with the following attributes
          const { errors, data: newTodo } = await client.models.Todo.create({
            // prompt the user to enter the title
            content: window.prompt("title"),
            done: false,
            priority: "medium",
          });
          console.log(errors, newTodo);
        }}
      >
        Create{" "}
      </Button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
    </div>
  );
}
