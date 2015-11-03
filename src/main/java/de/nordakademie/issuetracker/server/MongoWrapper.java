package de.nordakademie.issuetracker.server;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.StringWriter;
import java.util.regex.Pattern;

import org.bson.Document;

import com.mongodb.BasicDBObject;
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
	public void writeDocumentToMongo(Document document, String collectionName){
		mongoDb.getCollection(collectionName).insertOne(document);
	}
	
	public void searchInMongo(String searchTerm, String collectionName){
		BasicDBObject query = new BasicDBObject();
		query.put("status",  java.util.regex.Pattern.compile(".*"+searchTerm+".*", Pattern.CASE_INSENSITIVE));
		System.out.println(mongoDb.getCollection(collectionName).find(query).first());
		
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
