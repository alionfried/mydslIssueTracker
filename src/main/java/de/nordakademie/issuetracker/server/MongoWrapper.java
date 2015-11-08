package de.nordakademie.issuetracker.server;

import java.util.ArrayList;
import java.util.regex.Pattern;

import org.bson.Document;
import org.bson.types.ObjectId;

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
	
	public void updateDocumentInMongo(Document document, String collectionName){
		ObjectId objectId = new ObjectId(document.getString("_id"));
		document.remove("_id");
		Document filter = new Document ("_id",objectId);
		System.out.println("Filter: " + filter.toString());
		System.out.println(mongoDb.getCollection(collectionName).replaceOne(filter, document));
	};
	
	public Document searchInMongo(String searchTerm, String collectionName){
		BasicDBObject query = new BasicDBObject();
		query.put("beschreibung",  java.util.regex.Pattern.compile(".*"+searchTerm+".*", Pattern.CASE_INSENSITIVE));
		Document issue = mongoDb.getCollection(collectionName).find(query).first();
		System.out.println(issue);
		return issue;		
	}
	
	public ArrayList<String> getLatestIssues(String collectionName){
	   Iterable<Document> documents = mongoDb.getCollection(collectionName).find().limit(10).sort(new Document("_id",-1));
	   ArrayList<String> documentsArray = new ArrayList<String>();
	   for (Document doc : documents){
		   documentsArray.add(doc.toJson());
	   }
	   System.out.println(documentsArray);
	   return documentsArray;
	};

	public String getFullCollectionAsJson(String collectionName){
		MongoCollection<Document> collection = (MongoCollection<Document>) mongoDb.getCollection(collectionName);
		return collectionToJsonArray(collection);
	}

	public String collectionToJsonArray(MongoCollection<Document> collection) {
		ArrayList<String> documentsArray = new ArrayList<String>();
		   for (Document doc : collection.find()){
			   documentsArray.add(doc.toJson());
		   }
		   return documentsArray.toString();		
	}
}
