package json;

import java.io.File;
import java.util.Scanner;

public class JsonFileReader {

	public static String readJsonFromFile(String filename) {
		String content = "";
		try (Scanner scanner = new Scanner(new File(filename)).useDelimiter("\\Z")) {
			if (scanner.hasNext()) {
				content = scanner.next();
			} else {
				scanner.close();
			}
		} catch (Exception e) {
			System.out.println("file not found");
		}
		return content;
	}
}
