"""
This module contains the functions to process the conversationDB and store it in the database.
"""

import json
import pandas as pd
from ..utils import openai_embedding_list
from ..utils import postgres_userpass_conn_sync
from ..config import settings


## Get DataFrame

def get_data_frame():
    with open('../data/type1/context_reponse.json', 'r') as f:
        data = f.readlines()
        data = [json.loads(line) for line in data]

    contexts = [context["Context"] for context in data]
    responses = [response["Response"] for response in data]
    df = pd.DataFrame({'context': contexts, 'response': responses})

    return df

def add_embedding(dataframe, chunk_size = 100):
    embeddings = openai_embedding_list(dataframe["context"].tolist(), chunk_size)
    dataframe["semantic_vector"] = embeddings

    return dataframe


## DB connection
conn, cur = postgres_userpass_conn_sync()

def create_table():
    try:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS conversationdb(
                id SERIAL PRIMARY KEY,
                context TEXT NOT NULL,
                response TEXT NOT NULL,
                semantic_vector vector(1536)
            );
        """)
        conn.commit()
        print("Table created successfully!!!")
    except Exception as e:
        print(f"Error creating table: {e}")


def insert_data(dataframe: pd.DataFrame):
    try:
        for index, row in dataframe.iterrows():
            cur.execute("""
                INSERT INTO conversationdb (context, response, semantic_vector)
                VALUES (%s, %s, %s)
            """, (
                row['context'], 
                row['response'],
                row['semantic_vector']
            ))
        conn.commit()
        print("Data inserted successfully!!!")
    except Exception as e:
        print(f"Error inserting data: {e}")

