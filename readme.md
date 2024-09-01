# IMRaD Introduction Analysis - User Data Microservice

This repository contains the User Data Microservice for the IMRaD Introduction Analysis platform, a Micro SaaS application developed for my graduation thesis. 

**Parent Repository (Next.js Frontend & API):**
[https://github.com/stormsidali2001/graduation_IMRAD_introduction_analysis_SaaS](https://github.com/stormsidali2001/graduation_IMRAD_introduction_analysis_SaaS)

**AI Models and PDF Extractor Microservices:**
[https://github.com/stormsidali2001/imrad_intros_moves_submoves_python_microservices](https://github.com/stormsidali2001/imrad_intros_moves_submoves_python_microservices) 

## Microservice Functionality

The User Data Microservice is responsible for:

* **Storing User Data:**  Persisting user-related data, including analyzed introductions, predictions generated by the AI models, summaries, and author thought processes (for premium users). 
* **Managing Feedback:**  Storing and managing user feedback on the AI predictions, which is crucial for improving model accuracy over time. 

## Technology Stack

* **Express.js:** The microservice is built using Express.js, a fast and minimalist web framework for Node.js.
* **TypeScript:**  TypeScript is used to add static typing and improve code maintainability.
* **MongoDB:** The data is stored in a MongoDB database, a NoSQL database chosen for its flexibility and scalability. 

## Data Model

The data is structured using MongoDB documents and includes the following key collections:

* **Users:**  Stores basic user information (retrieved from the Next.js API during registration/login).
* **Introductions:**
    * Stores the analyzed introductions, including the original text. 
    * Contains an array of sentences, each with its predicted IMRaD move, sub-move, and confidence scores.
    * Stores the generated summary and author's thought process (for premium users). 
* **Feedback:**
    * Stores user feedback on individual sentences, including whether the user agreed with the prediction ("liked"), the reason for feedback, and any corrections they provided. 


## Communication

This microservice communicates with the Next.js API and the AI Models microservice using HTTP/REST. It also uses Redis, a message broker, for asynchronous communication to handle feedback submission and the generation of summaries and thought processes. 

## Datasets

The AI models that generate the data stored in this microservice are trained on a unique dataset of over 169,000 sentences, created using a custom pipeline and Google's Gemini Pro model. More details about the datasets are available in the main repository's README: 

[https://github.com/stormsidali2001/graduation_IMRAD_introduction_analysis_SaaS](https://github.com/stormsidali2001/graduation_IMRAD_introduction_analysis_SaaS)

## Running the Microservices

later.

## License

MIT
