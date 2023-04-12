#include <stdio.h>
#include <curl/curl.h>

void send_message(const char *message) {
  CURL *curl;
  CURLcode res;

  curl_global_init(CURL_GLOBAL_DEFAULT);
  curl = curl_easy_init();

  if (curl) {
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");

    curl_easy_setopt(curl, CURLOPT_URL, "http://bigunbot.myftp.org:3001/send");

    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, message);
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
}

int main(void) {
  const char *message = "{\"message\": \"Hello Mr.Website from the C program! - ELIAS\"}";
  send_message(message);

  return 0;
}
