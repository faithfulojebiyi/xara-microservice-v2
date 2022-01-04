
# Xara 
## A template and category Microservice





## Environment Variables

To run this project, you will need to add the following environment variables to your  .env file
both in the category and template directory respectively

look at the example in `.env.example`

`DATABASE_URL`

`TEST_DATABASE_URL`

`NODE_ENV`

  
## Run Locally

Clone the project

```bash
  git clone https://github.com/faithfulojebiyi/xara-microservice.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```
Install dependencies for category microservice

```bash
  cd category
```

```bash
  npm install
```

Start the dev server for category microservice

```bash
  cd category
```

```bash
  npm run dev
```

Install dependencies for template microservice

```bash
  cd template
```

```bash
  npm install
```

Start the dev server for template microservice

```bash
  cd template
```

```bash
  npm run dev
```

  
## Running Tests

To run tests, run the following command

```bash
  npm test
```

  
## API Reference

#### Create category

```http
  POST /api/v1/category/create
```

| Request Body Data | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `displayName` | `string` | **Required**. Name of the category |
| `categoryId`  | `string` |**Default**  `Null` The category to be added to |

#### Move category

```http
  PATCH /api/v1/category/move/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of the category to be moved |

| Request Body Data | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `toCategoryId`      | `string` | **Required**. The id of the category to move to |



#### Delete category

```http
  DELETE /api/v1/category/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of category to be deleted|

#### Create template

```http
  POST /api/v1/template/create
```

| Request Body Data | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `displayName` | `string` | **Required**. Name of the template |
| `categoryId`  | `string` |**Default**  `Null` The category to be added to |


  
#

## Documentation Reference

### Models
 
#### Categories

```
const categorySchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  ancestorsIds: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    }
  ]
})

```
- The `categoryId` is the direct parent category `id`. If the category is an Alpha category that is does not have a parent category the categoryId is `null`

- The `ancestorsIds` contains the ids of all the parent categories. If the category is an Alpha category that is does not have a parent category the `ancestorsIds` is an empty array `[]`

#### Templates

```
const templateSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  ancestorsIds: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    }
  ]
})
```

- The `categoryId` is the direct parent category `id`. If the template is an Alpha template that is does not have a parent category the categoryId is `null`

- The `ancestorsIds` contains the ids of all the parent categories. If the template is an Alpha template that is it does not have a parent category the `ancestorsIds` is an empty array `[]`


### ACID
Using Transctions to make sure write operations are atomic. Most importantly when moving a category or deleting a category we have to make sure the subCategories and template reflect the changes.

#### Move Category

```
static async moveCategoryToNewCategory (req, res, next) {
  const session = await db.startSession()
  session.startTransaction()
  try {
    const queryTemplate1 = await Template.updateMany({
      $and: [
        { ancestorsIds: { $all: [req.category.categoryId, req.category._id] } },
        { categoryId: { $ne: req.category.categoryId } }
      ]
    },
    { $push: { ancestorsIds: req.body.toCategoryId } }
    )
    const queryTemplate2 = await Template.updateMany({
      $and: [
        { ancestorsIds: { $all: [req.category.categoryId, req.category._id] } },
        { categoryId: { $ne: req.category.categoryId } }
      ]
    },
    { $pullAll: { ancestorsIds: [req.category.categoryId] } }
    )
    const queryCategory1 = await Category.updateMany(
      { ancestorsIds: { $all: [req.category.categoryId, req.category._id] } },
      { $push: { ancestorsIds: req.body.toCategoryId } }
    )
    const queryCategory2 = await Category.updateMany(
      { ancestorsIds: { $all: [req.category.categoryId, req.category._id] } },
      { $pullAll: { ancestorsIds: [req.category.categoryId] } }
    )
    const queryCategory3 = await Category.updateOne(
      { _id: req.category._id },
      { $set: { categoryId: req.body.toCategoryId }, $push: { ancestorsIds: req.body.toCategoryId } }
    )
    const queryCategory4 = await Category.updateOne(
      { _id: req.category._id },
      { $pullAll: { ancestorsIds: [req.category.categoryId] } }
    )

    session.commitTransaction()
    return successResponse(res, {
      message: UPDATE_CATEGORY_SUCCESS,
      data: {
        queryTemplate1,
        queryTemplate2,
        queryCategory1,
        queryCategory2,
        queryCategory3,
        queryCategory4
      }
    })
  } catch (e) {
    session.abortTransaction()
    const dbError = new DBError({
      status: UPDATE_CATEGORY_ERROR,
      message: e.message
    })
    moduleErrLogMessager(dbError)
    next(new ApiError({ message: UPDATE_CATEGORY_ERROR }))
  } finally {
    session.endSession()
  }
}

```


`req.category.categoryId` this is the parent category `id` the current category belongs to Also known as the category to be moved from

`req.body.toCategoryId` this is category to be moved to and should now become the new `categoryId` of the category we want to move

#### Delete Category
```
static async deleteCategory (req, res, next) {
  const session = await db.startSession()
  session.startTransaction()
  try {
    const templateQuery1 = await Template.deleteMany({ ancestorsIds: { $all: [req.params.id] } })
    const categoryQuery1 = await Category.deleteMany({ ancestorsIds: { $all: [req.params.id] } })
    const categoryQuery2 = await Category.deleteOne({ _id: req.params.id })
    const category = await Category.findById({ _id: req.params.id })
    const subCategory = await Category.find({ ancestorsIds: { $all: [req.params.id] } })
    const template = await Template.find({ ancestorsIds: { $all: [req.params.id] } })
    session.commitTransaction()
    return successResponse(res, {
      message: DELETE_CATEGORY_SUCCESS,
      data: {
        templateQuery1,
        categoryQuery1,
        categoryQuery2,
        category,
        subCategory,
        template
      }
    })
  } catch (e) {
    session.abortTransaction()
    const dbError = new DBError({
      status: DELETE_CATEGORY_ERROR,
      message: e.message
    })
    moduleErrLogMessager(dbError)
    next(new ApiError({ message: DELETE_CATEGORY_ERROR }))
  } finally {
    session.endSession()
  }
}
```

## 🚀 About Me
### My name is Faithful Ojebiyi. 
I am a framework-agnostic Backend Heavy Javascript developer;

- 🌱 I’m currently learning how to build D3Apps using blockchain
- 🖥 My current development stack is React, Vuejs, Nextjs, Nuxt, Nodejs, MongoDB, PostgreSQL, MySQL, Redis Expressjs, Python, Flask, Docker, 
- 📫 How to reach me: [faithfulojebiyi@gmail.com](mailto:faithfulojebiyi@gmail.com)
- 😄 Pronouns: He/Him
- ⚡ Fun fact: I turn coffee to code and music keeps me going. I am a perfectionist
- 🏅 Github Profile Visits ![Visitor Count](https://profile-counter.glitch.me/faithfulojebiyi/count.svg)

  