const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoapplication.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
let word = null;
const checking_1 = (requestquery) => {
  return (
    requestquery.priority !== undefined && requestquery.status !== undefined
  );
};
const checking_2 = (requestquery) => {
  return requestquery.priority !== undefined;
};
const checking_3 = (requestquery) => {
  return requestquery.status !== undefined;
};
app.get(`/todos/`, async (request, response) => {
  const { search_q = "", priority, status } = request.query;
  switch (true) {
    case checking_1(request.query):
      dbterms = `select * from todo where todo like '%${search_q}%' and status='${status}' and priority='${priority}';`;
      break;

    case checking_2(request.query):
      dbterms = `select * from todo where todo like'%${search_q}%' and priority='${priority}';`;
      break;
    case checking_3(request.query):
      dbterms = `select * from todo where todo like'%${search_q}%' and priority='${priority}';`;
      break;
    default:
      dbterms = `select * from todo where todo like '%${search_q}%';`;
  }

  word = await db.get(dbterms);
  response.send(word);
});

/*second*/
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const element = `select * from todo where id='${todoId}';`;
  const worked = await db.get(element);
  response.send(worked);
});

/*posting8*/
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const dbworking = `insert into todo(id,todo,priority,status)
    values('${id}','${todo}','${priority}','${status}');`;
  const working = await db.run(dbworking);
  response.send("Todo Successfully Added");
});
/*PUT CASES */
let updatedone = null;
app.put("todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { todo, priority, status } = request.body;
  switch (True) {
    case priority !== undefined:
      updatedone = "priority";

      word = `update todo set priority='${priority}'
            where id='${todoId}';`;
      giving = await db.run(word);
      break;
    case status !== undefined:
      updatedone = "status";
      word = `update todo set status='${status}'
            where id='${todoId}';`;
      giving = await db.run(word);
      break;
    default:
      updatedone = "todo";
      word = `update todo set todo='${todo}'
            where id='${todoId}';`;
      giving = await db.run(word);
  }

  response.send(`'${updatedone}'Updated`);
});

/*delete*/
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const dbdetails = `delete from todo where id='${todoId}';`;
  const changing = db.run(dbdetails);
  response.send(changing);
});
