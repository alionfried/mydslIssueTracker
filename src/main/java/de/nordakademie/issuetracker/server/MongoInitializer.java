package de.nordakademie.issuetracker.server;

import java.util.ArrayList;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.MongoCommandException;
import com.mongodb.client.MongoDatabase;

import json.JsonFileReader;

public class MongoInitializer {
	
	protected MongoClient mongo_client;
	
	public MongoClient client() {
		if(mongo_client == null) {
			mongo_client = new MongoClient("localhost", 27017);
		}
		return mongo_client;
	}

	public void initialize(boolean dropBeforeRun) {
		MongoDatabase ticketDB = createTicketDB(dropBeforeRun);

		fillTicketDB(ticketDB);

		// Zeigt alle Datenbanken an
//		Iterable<String> dbs = client().listDatabaseNames();
//		dbs.forEach((String element) -> System.out.println(element));
	}

	private MongoDatabase createTicketDB(boolean dropBeforeRun) {
		MongoDatabase ticketDB = client().getDatabase("mydslIssueTracker");
		createCollectionIfNotExsists(ticketDB, "persons",dropBeforeRun);
		createCollectionIfNotExsists(ticketDB, "issueTypes",dropBeforeRun);
		return ticketDB;
	}
	
	@SuppressWarnings("unchecked")
	private static void fillTicketDB(MongoDatabase db){
		new JsonFileReader();
		Document persons = Document.parse(JsonFileReader.readJsonFromFile("src/main/resources/json/person.json"));
		db.getCollection("persons").insertMany((ArrayList<? extends Document>) persons.get("persons"));
		
		Document issueTypes = Document.parse(JsonFileReader.readJsonFromFile("src/main/resources/json/issueTypes.json"));
		db.getCollection("issueTypes").insertMany((ArrayList<? extends Document>) issueTypes.get("issueTypes"));

	}

	private static void createCollectionIfNotExsists(MongoDatabase db, String collectionName,boolean dropBeforeRun) {
		try {
			db.createCollection(collectionName);
		} catch (MongoCommandException me) {
			System.out.println("Collection: " + collectionName + " existiert bereits");
			if(dropBeforeRun){
				System.out.println("Lösche vorhandene Daten für: " + collectionName);
				db.getCollection(collectionName).deleteMany(new Document());
			}
		}
	}
}
