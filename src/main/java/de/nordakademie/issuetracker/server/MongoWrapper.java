package de.nordakademie.issuetracker.server;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.StringWriter;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class MongoWrapper {
	MongoClient mongoClient;
	String databaseName;
	MongoDatabase mongoDb;

	public MongoWrapper(MongoClient mongoClient, String databaseName) {
		this.mongoClient = mongoClient;
		this.databaseName = databaseName;
		this.mongoDb = mongoClient.getDatabase(databaseName);
	}

	public String getFullCollectionAsJson(String collectionName){
		MongoCollection<Document> collection = (MongoCollection<Document>) mongoDb.getCollection(collectionName);
		return collectionToJsonArray(collection);
	}

	public String collectionToJsonArray(MongoCollection<Document> collection) {
		StringWriter sw = new StringWriter();
		BufferedWriter writer = new BufferedWriter(sw);
		try {
			try {
				writer.write("[");
				writer.newLine();
				int counter = 1;
				for (Document doc : collection.find()) {
					writer.write(doc.toJson());
					if (counter<collection.count()){
						writer.write(",");
					}
					writer.newLine();
					counter++;
				}
				writer.write("]");
			} finally {
				writer.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return sw.toString();
	}
}
