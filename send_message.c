#include <stdio.h>
#include <curl/curl.h>
#include <stdlib.h>
#include <string.h>


char *escape_json_string(const char *input) {
    int input_length = strlen(input);
    int output_length = 0;
    
    const char *input_position;
    char *output, *output_position;
    
    for (input_position = input; *input_position; ++input_position) {
        if (*input_position == '\\' || *input_position == '"' || *input_position == '\n') {
            output_length += 2;
        } else {
            output_length++;
        }
    }

    output = (char *)malloc((output_length + 1) * sizeof(char));
    output_position = output;

    for (input_position = input; *input_position; ++input_position) {
        switch (*input_position) {
            case '\\':
            case '\"':
                *output_position++ = '\\';
                *output_position++ = *input_position;
                break;
            case '\n':
                *output_position++ = '\\';
                *output_position++ = 'n';
                break;
            default:
                *output_position++ = *input_position;
        }
    }
    
    *output_position = '\0';

    return output;
}

char *create_json_message(const char *input) {
    char *escaped_input = escape_json_string(input);
    int escaped_length = strlen(escaped_input);
    int json_length = escaped_length + 15; // extra characters for JSON format

    char *json_message = (char *)malloc((json_length + 1) * sizeof(char));
    sprintf(json_message, "{\"message\": \"%s\"}", escaped_input);

    free(escaped_input);

    return json_message;
}


void send_message(const char *message) {
    CURL *curl;
    CURLcode res;

    char *json_message = create_json_message(message);

    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();

    if (curl) {
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");

        curl_easy_setopt(curl, CURLOPT_URL, "http://bigunbot.myftp.org:3001/send");
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_message);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        res = curl_easy_perform(curl);
        if (res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        } else {
            printf("Message sent successfully.\n");
        }
        
        curl_easy_cleanup(curl);
        curl_slist_free_all(headers);
    }

    curl_global_cleanup();
    free(json_message);
}

int main(void) {
  
  //const char *message = "{\"message\": \"Pulvinar etiam non quam lacus suspendisse faucibus interdum posuere \\nlorem ipsum dolor sit amet consectetur adipiscing elit duis tristique\\nsollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum\"}";
  const char *message = "Risus ultricies tristique nulla aliquet enim tortor at auctor urna nun \nid cursus metus aliquam eleifend mi in nulla posuere sollicitudin aliquam\nultrices sagittis orci a scelerisque purus semper eget";
  //const char *message = "pulvinar etiam non quam lacus suspendisse faucibus interdum posuere \nlorem ipsum dolor sit amet consectetur adipiscing elit duis tristique\nsollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum";

  send_message(message);

  return 0;
}