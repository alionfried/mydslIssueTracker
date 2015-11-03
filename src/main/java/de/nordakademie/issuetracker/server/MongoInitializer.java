package de.nordakademie.issuetracker.server;

import static de.nordakademie.issuetracker.server.DataJson.*;

import java.util.ArrayList;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.MongoCommandException;
import com.mongodb.client.MongoDatabase;

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
		Iterable<String> dbs = client().listDatabaseNames();
		dbs.forEach((String element) -> System.out.println(element));
	}

	private MongoDatabase createTicketDB(boolean dropBeforeRun) {
		MongoDatabase ticketDB = client().getDatabase("mydslIssueTracker");
		createCollectionIfNotExsists(ticketDB, "persons",dropBeforeRun);
		createCollectionIfNotExsists(ticketDB, "issueTypes",dropBeforeRun);
		return ticketDB;
	}
	
	@SuppressWarnings("unchecked")
	private static void fillTicketDB(MongoDatabase db){
		Document persons = Document.parse(PERSONS_JSON);
		db.getCollection("persons").insertMany((ArrayList<? extends Document>) persons.get("persons"));
		
		Document issueTypes = Document.parse(ISSUETYPES_JSON);
		db.getCollection("issueTypes").insertMany((ArrayList<? extends Document>) issueTypes.get("issueTypes"));
		
		// ArrayList<Document> personsArray=(ArrayList) persons.get("persons");
		// db.getCollection("persons").insertMany(personsArray);
		// personsArray.forEach((person) ->
		// db.getCollection("persons").insertOne(person));
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
