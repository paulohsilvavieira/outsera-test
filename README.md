
# Outsera teste tecnico

Teste tecnico outsera


## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/paulohsilvavieira/outsera-test.git
```

Entre no diretório do projeto

```bash
  cd outsera-test
```

Instale as dependências

```bash
  npm install
```

Caso queria colocar outro arquivo csv no lugar do `movielist.csv`,
copie e cole e apague o antigo `movielist.csv` renomeie o novo para `movielist.csv`

Inicie o servidor

```bash
  npm start
```

## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm run test
```
## Documentação da API 

### Filmes - /movies

### 1. Salvando o filme 

| URL        | Metodo | Descriçao                       |
|------------|--------|-----------------------------------|
| `/movies`  | `POST` |Adiciona um fime no banco de dados |

**Request Body:**

| Field     | Type    | Descriçao        |
|-----------|---------|--------------------|
| `title`   | string  | titulo |
| `year`    | number  | ano de lançamento  |
| `studios` | string  | estudios que lançaram o filme |
| `producers` | string  | produtores do filme |
| `winner`  | boolean |se foi vencedor do framboesa de ouro |

**Responses:**

| Status Code | Descriçao                  |
|-------------|------------------------------|
| `201`       | Filme criado. |
| `400`       | Erro de validaçao dos campos. |

---

### 2. Lista todos os filmes

| URL        | Metodo | Descriçao                      |
|------------|--------|----------------------------------|
| `/movies`  | `GET`  | Retorna todos os filmes |

**Response:**

| Field     | Type    | Descriçao        |
|-----------|---------|--------------------|
| `movie_id`   | number  | id do filme no banco |
| `title`   | string  | titulo |
| `year`    | number  | ano de lançamento  |
| `studios` | string  | estudios que lançaram o filme |
| `producers` | string  | produtores do filme |
| `winner`  | boolean |se foi vencedor do framboesa de ouro |

**Example Response:**

```json
[
  {
    "movie_id": 1, 
    "title": "Movie Title",
    "year": 2023,
    "studios": "Studio Name",
    "producers": "Producer Name",
    "winner": "false"
  }
]
```

**Responses:**

| Status Code | Descriçao                     |
|-------------|---------------------------------|
| `200`       | Quando retorna a lista com sucesso |
| `500`       | Quando ocorre um erro |

---

### 3. Retorna filme pelo ID

| URL             | Metodo | Descriçao                    |
|-----------------|--------|--------------------------------|
| `/movies/:id`   | `GET`  | Retorna o filme pelo id do banco. |

**Response:**

| Field     | Type    | Descriçao        |
|-----------|---------|--------------------|
| `movie_id`   | number  | id do filme no banco |
| `title`   | string  | titulo |
| `year`    | number  | ano de lançamento  |
| `studios` | string  | estudios que lançaram o filme |
| `producers` | string  | produtores do filme |
| `winner`  | boolean |se foi vencedor do framboesa de ouro |

**Example Response:**

```json
{
  "movie_id": 1,
  "title": "Movie Title",
  "year": 2023,
  "studios": "Studio Name",
  "producers": "Producer Name",
  "winner": "false"
}
```

**Responses:**

| Status Code | Descriçao                             |
|-------------|-----------------------------------------|
| `200`       | Successfully retrieved the movie.       |

---

### 4. Atualiza filme

| URL             | Metodo | Descriçao                    |
|-----------------|--------|--------------------------------|
| `/movies/:id`   | `PUT`  | Updates an existing movie.     |

**Request Body:**

| Field     | Type    | Descriçao        |
|-----------|---------|--------------------|
| `title`   | string  | Title of the movie |
| `year`    | string  | Year of release    |
| `winner`  | boolean | Whether the movie won an award |

**Responses:**

| Status Code | Descriçao                             |
|-------------|-----------------------------------------|
| `200`       | Movie was successfully updated.         |
| `400`       | Invalid input or missing required fields. |

---

### 5. Remove um filme

| URL             | Metodo | Descriçao                    |
|-----------------|--------|--------------------------------|
| `/movies/:id`   | `DELETE`| Deletes a movie by its ID.    |

**Responses:**

| Status Code | Descriçao                             |
|-------------|-----------------------------------------|
| `204`       | Movie was successfully deleted.         |
| `404`       | Movie with the specified ID not found.  |


### Produtores - /PRODUCERS

### 1. Salvando o produtor

| URL        | Metodo | Descriçao                       |
|------------|--------|-----------------------------------|
| `/producers`  | `POST` |Adiciona um produtor no banco de dados |

**Request Body:**

| Field     | Type    | Descriçao        |
|-----------|---------|--------------------|
| `name`   | string  | nome do produtor |

**Responses:**

| Status Code | Descriçao                  |
|-------------|------------------------------|
| `201`       | Produtor criado. |
| `400`       | Erro de validaçao dos campos. |

---

### 2. Listagem de todos os produtores

| URL        | Metodo | Descriçao                      |
|------------|--------|----------------------------------|
| `/producers`  | `GET`  | Retorna todos os produtores |

**Response:**

| Field     | Type    | Descriçao        |
|-----------|---------|--------------------|
| `id`   | number  | id do produtor no banco |
| `name`   | string  | nome do produtor  |

**Example Response:**

```json
[
  {
    "id": 1, 
    "name": "John doe",
  }
]
```

**Responses:**

| Status Code | Descriçao                     |
|-------------|---------------------------------|
| `200`       | Quando retorna a lista com sucesso |
| `500`       | Quando ocorre um erro |

---

### 3. Captura o produtor pelo id

| URL             | Metodo | Descriçao                    |
|-----------------|--------|--------------------------------|
| `/producers/:id`   | `GET`  | Retorna o produtor pelo id do banco. |

**Response:**

| Field     | Type    | Descriçao        |
|-----------|---------|--------------------|
| `id`   | number  | id do produtor no banco |
| `name`   | string  | nome do produtor |

**Example Response:**

```json
{
  "id": 1,
  "name": "John doe",
}
```

**Responses:**

| Status Code | Descriçao                             |
|-------------|-----------------------------------------|
| `200`       | Retorna um produtor.       |

---

### 4. Atualizar produtor

| URL             | Metodo | Descriçao                    |
|-----------------|--------|--------------------------------|
| `/producer/:id`   | `PUT`  | Atualiza o produtor.     |

**Request Body:**

| Field     | Type    | Descriçao        |
|-----------|---------|--------------------|
| `name`   | string  | Novo nome do produtor |

**Responses:**

| Status Code | Descriçao                             |
|-------------|-----------------------------------------|
| `200`       | Produtor atualizado com sucesso.         |
| `400`       | Erro de validaçao |

---

### 5. Remove produtor

| URL             | Metodo | Descriçao                    |
|-----------------|--------|--------------------------------|
| `/producers/:id`   | `DELETE`| Remove produtor.    |

**Responses:**

| Status Code | Descriçao                             |
|-------------|-----------------------------------------|
| `204`       | Produtor foi removido com sucesso.      |


### 6. Retornando o intervalo dos premiados


| URL        | Metodo | Descriçao                       |
|------------|--------|-----------------------------------|
| `/producers/award/interval`  | `GET` | Retorna os dois produtores que receberem o premio mais rapido duas vezes seguida e o mais demorado duas vezes seguidas  |

#### Retorno esperado

```json
 {
  "min": [
    {
      "producer": "Joel Silver",
      "interval": 1,
      "previousWin": 1990,
      "followingWin": 1991
    },
    {
      "producer": "Bo Derek",
      "interval": 6,
      "previousWin": 1984,
      "followingWin": 1990
    }
  ],
  "max": [
    {
      "producer": "Buzz Feitshans",
      "interval": 9,
      "previousWin": 1985,
      "followingWin": 1994
    },
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```


### Estudios - /studios

### 1. Criar um Estúdio

| URL          | Método | Descrição                          |
|--------------|--------|------------------------------------|
| `/studios`   | `POST` | Adiciona um novo estúdio à coleção. |

**Corpo da Requisição:**

| Campo   | Tipo   | Descrição              |
|---------|--------|------------------------|
| `name`  | string | Nome do estúdio         |

**Respostas:**

| Código de Status | Descrição                              |
|------------------|----------------------------------------|
| `201`            | Estúdio criado com sucesso.            |
| `400`            | Entrada inválida ou campos obrigatórios ausentes. |

---

### 2. Listar Todos os Estúdios

| URL          | Método | Descrição                          |
|--------------|--------|------------------------------------|
| `/studios`   | `GET`  | Retorna uma lista de todos os estúdios. |

**Resposta:**

| Campo  | Tipo   | Descrição          |
|--------|--------|--------------------|
| `name` | string | Nome do estúdio    |

**Exemplo de Resposta:**

```json
[
  {
    "name": "Nome do Estúdio"
  }
]
```

**Respostas:**

| Código de Status | Descrição                               |
|------------------|-----------------------------------------|
| `200`            | Lista de estúdios retornada com sucesso. |
| `500`            | Ocorreu um erro ao buscar os dados.      |

---

### 3. Obter um Estúdio por ID

| URL             | Método | Descrição                         |
|-----------------|--------|-----------------------------------|
| `/studios/:id`  | `GET`  | Retorna um estúdio específico pelo ID. |

**Resposta:**

| Campo  | Tipo   | Descrição          |
|--------|--------|--------------------|
| `name` | string | Nome do estúdio    |

**Exemplo de Resposta:**

```json
{
  "name": "Nome do Estúdio"
}
```

**Respostas:**

| Código de Status | Descrição                               |
|------------------|-----------------------------------------|
| `200`            | Estúdio retornado com sucesso.          |

---

### 4. Atualizar um Estúdio

| URL             | Método | Descrição                        |
|-----------------|--------|----------------------------------|
| `/studios/:id`  | `PUT`  | Atualiza um estúdio existente.   |

**Corpo da Requisição:**

| Campo  | Tipo   | Descrição          |
|--------|--------|--------------------|
| `name` | string | Nome do estúdio    |

**Respostas:**

| Código de Status | Descrição                               |
|------------------|-----------------------------------------|
| `200`            | Estúdio atualizado com sucesso.         |
| `400`            | Entrada inválida ou campos obrigatórios ausentes. |

---

### 5. Excluir um Estúdio

| URL             | Método | Descrição                         |
|-----------------|--------|-----------------------------------|
| `/studios/:id`  | `DELETE`| Remove um estúdio pelo ID.        |

**Respostas:**

| Código de Status | Descrição                               |
|------------------|-----------------------------------------|
| `204`            | Estúdio excluído com sucesso.           |
