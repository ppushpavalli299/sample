package customer.sample.employee;



import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

import java.io.IOException;
import java.sql.Date;

public class SqlDateTypeAdapter extends TypeAdapter<Date> {

    @Override
    public void write(JsonWriter out, Date value) throws IOException {
        out.value(value != null ? value.toString() : null);
    }

    @Override
    public Date read(JsonReader in) throws IOException {
        String date = in.nextString();
        return date != null ? Date.valueOf(date) : null;
    }
}
