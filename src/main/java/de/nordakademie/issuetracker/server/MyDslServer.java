package de.nordakademie.issuetracker.server;

import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.staticFileLocation;

import java.io.InputStream;
import java.util.Scanner;

import org.bson.Document;
import org.eclipse.jetty.util.UrlEncoded;

import com.mongodb.MongoClient;

public class MyDslServer {
	public static void main(String[] args) {
		
		final String DATABASE_NAME = "mydslIssueTracker";
		
		MongoInitializer mi = new MongoInitializer();
		MongoClient mongoClient = mi.client();
		
		MongoWrapper mongoWrapper = new MongoWrapper(mongoClient,DATABASE_NAME);
		
		//Mongo initialisieren
		boolean deleteDataBeforeStart = true;
		mi.initialize(deleteDataBeforeStart);
		
		staticFileLocation("/html");
		
		get("/", (req, res) -> {
			return loadFile("/html/issuetracker.html");
		});
		
		get("/getIssueTypesFromDb", (req, res) -> {
			res.type("application/json");
			return mongoWrapper.getFullCollectionAsJson("issueTypes");
		});
		
		get("/getLatestIssues", (req, res) -> {
			res.type("application/json");
			return mongoWrapper.getLatestIssues("issues");
		});
		
		
		get("/getPersonsFromDb", (req, res) -> {
			res.type("application/json");
			res.status(200);
			return mongoWrapper.getFullCollectionAsJson("persons");
		});
		
		post("/submitIssue", (req, res) -> {
			String formData=UrlEncoded.decodeString(req.body());
			System.out.println("Writing to Mongo:" + formData.toString());
			
			Document formDataJson = Document.parse(formData);
			formDataJson.remove("_id");
			mongoWrapper.writeDocumentToMongo(formDataJson, "issues");
			res.status(200);
			return "";
		});
		
		post("/updateIssue", (req, res) -> {
			String formData=UrlEncoded.decodeString(req.body());
			System.out.println("Updateing in Mongo:" + formData.toString());
			
			Document formDataJson = Document.parse(formData);
			//entfernen wenn ObjectId in post enthalten
			//formDataJson.put("_id",new ObjectId("563d25ed782d2b35604da572"));
			mongoWrapper.updateDocumentInMongo(formDataJson, "issues");
			res.status(200);
			return "";
		});
		
		post("/search", (req, res) -> {
			String formData=UrlEncoded.decodeString(req.body());
			Document issue = mongoWrapper.searchInMongo(formData.toString(), "issues");
			res.type("application/json");
			res.status(200);
			System.out.println(res);
			return issue.toJson();
		});
	}
	
	public static String loadFile(String path){
		return getString(MyDslServer.class.getResourceAsStream(path));
	}

	private static String getString(InputStream is) {
		try(java.util.Scanner s = new Scanner(is).useDelimiter("\\A")){			
			return s.hasNext() ? s.next() : "";
		}catch (Exception e) {
			System.out.println("file not found");
			return "";
		}
	}
}
