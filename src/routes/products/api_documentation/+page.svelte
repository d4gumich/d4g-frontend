<script>
    import Navbar from "$lib/components/navbar.svelte";
    import { base } from '$app/paths';
    
    const currentPage = "api_documentation";
    let document_code_snippet = `# Define API URL
        api_url_1 = 'https://d4gumsi.pythonanywhere.com/api/v2/products/hangul'

        # Define Payload
        payload = {
            'kw_num': "5",
            'Return_ALL': False,
            'document_language': False,
            'document_title': True,
            'document_summary': False,
            'content': False,
            'report_type': True,
            'locations': True,
            'full_content': True,
            'markdown_text': True,
            'document_theme': False,
            'new_detected_disasters': True,
            "Author": False,
            "doc_created_date": False,
            "doc_modified_date": False,
            "num_of_pages": False,
            "charsPerPage": False,
        }
        
        # Define File to be uploaded
        files = {
            "file": ("filename.pdf", open("filepath/filename.pdf", "rb")),
        }
        
        # Make the Request
        response_1 = requests.post(api_url_1, files=files, data=payload)`

        let summary_code_snippet = `# Define API URL
        api_url_summary = "https://d4gumsi.pythonanywhere.com/api/v2/products/summary"
 
        # Extract summary parameters from the first response
        summary_parameters = response_1.json()["document_summary_parameters"]
 
        # Check required flag and make the second request
        if (payload["document_summary"]) or (payload["Return_ALL"]):
	    response_summary = requests.post(api_url_summary, json=summary_parameters)
 
        # Print the generated summary
        print("GENERATED SUMMARY: ", response_summary.json()["summary"])`

        let workflow_code_snippet = `import requests
        import time
        
        # Define the URLs
        api_url_1 = 'https://d4gumsi.pythonanywhere.com/api/v2/products/hangul'
        
        api_url_summary = "https://d4gumsi.pythonanywhere.com/api/v2/products/summary"
        
        
        filename = "" # ADD here the file name
        filepath = "" # ADD here the file path
        
        pdf_path = f"{filepath}/{filename}.pdf"
        
        # Create the file and kw that will be passed to the API
        payload = {
            "kw_num": "5",
        
            "Return_ALL": False,
            'document_language': False,
            'document_title': True,
            'document_summary': False,
            'content': False,
            'report_type': True,
            'locations': True,
            'full_content': True,
            'markdown_text': True,
            'document_theme': False,
            'new_detected_disasters': True,
            "Author": False,
            "doc_created_date": False,
            "doc_modified_date": False,
            "num_of_pages": False,
            "charsPerPage": False,
        }
        
        # This is the file to be sent to the API
        files = {
            "file": (f"{filename}.pdf", open(pdf_path, "rb")),
        }
        
        print("----------RUNING the API CALLS----------")
        
        # Try to get a response from the API
        # If it does not work, try a second time
        # To allow the server to restart
        try:
            response_1 = requests.post(api_url_1, files=files, data=payload)
        except:
            time.sleep(2)
            response_1 = requests.post(api_url_1, files=files, data=payload)
        
        # Get the data from the first API call
        # to use the parameters for the second API call
        summary_parameters = response_1.json()["document_summary_parameters"]
        
        print("Response keys: ", response_1.json().keys())
        
        time.sleep(1)
        
        try:
            if (payload["document_summary"]) | (payload["Return_ALL"]):
                response_summary = requests.post(api_url_summary, json=summary_parameters)
        
                print("GENERATED SUMMARY: ",response_summary.json()["summary"])
 
 
	    # If no response, try again
        except:
            time.sleep(2)
            if (payload["document_summary"]) | (payload["Return_ALL"]):
                response_summary = requests.post(api_url_summary, json=summary_parameters)
        
                print("GENERATED SUMMARY: ",response_summary.json()["summary"])
        `
  </script>
  
  <Navbar {currentPage} />
  <div class="simex-container">
    <h1>Hangul API Documentation</h1>
    <h2>Overview</h2>
    <p>
        This documentation covers the usage of two API endpoints of Hangul provided by <a href="https://d4gumsi.pythonanywhere.com">https://d4gumsi.pythonanywhere.com</a> for handling document processing and summarization. Below is an outline of the endpoints, payload structure, and the sequence of API calls.
    </p>
    <p>To learn more about Hangul <a href="{base}/products/hangul">here</a>.</p>
    <h3>Jump to sections:</h3>
    <ul>
        <li><a href="#endpoints">Endpoints</li>
            <ol>
                <li><a href="#docu_processing_endpoint">Document Processing Endpoint</li>
                    <ul>
                        <li><a href="#payload_params">Payload Parameters</li>
                        <li><a href="#response_keys">Response Keys</li>
                    </ul>
                <li><a href="#docu_summary_endpoint">Document Summary Endpoint</li>
            </ol>
        <li><a href="#workflow">Complete Workflow</li>
            <ul>
                <li><a href="#sample_code">Sample Code</li>
            </ul>
    </ul>
    <h2 id="endpoints" class="anchor">Endpoints</h2>
    <h3 id="docu_processing_endpoint" class="anchor"><i>1. Document Processing Endpoint</i></h3>
    <p>
        <span class="bolded">URL: </span><a href="https://d4gumsi.pythonanywhere.com/api/v2/products/hangul">https://d4gumsi.pythonanywhere.com/api/v2/products/hangul</a>
    </p>
    <p><span class="bolded">Method: </span> <u>POST</u></p>
    <p><span class="bolded">Description: </span>This endpoint processes a given PDF document based on the specified payload parameters.</p>
    <p><span class="bolded">File: </span>A PDF file to be sent along with the payload.</p>
    <p><span class="bolded">Response: </span>The response will be a dictionary which contains various keys, one of which is 
        <u><i>document_summary_parameters  </i></u> that will be used for the next API call.</p>
    <h3 id="payload_params" class="anchor">Payload Parameters</h3>
    <p><i><span class="grey-bolded">kw_num (str): </span></i>Number of keywords to extract.</p>
    <p><i><span class="grey-bolded">Return_ALL (bool): </span></i>A flag to indicate if all available data should be returned. <u>If this one True, it overrides all the rest.</u></p>
    <p><span class="bolded">Document-related flags (bool): </span> Flags to specify if certain document attributes should be extracted: </p>
    <ul>
        <li><i><span class="grey-bolded">document_language: </span></i>The language of the document.</li>
        <li><i><span class="grey-bolded">document_title: </span></i>A selection of the most likely titles of the document with the weight of each title likelihood.</li>
        <li><i><span class="grey-bolded">document_summary: </span></i>The summary of the document and the keywords of the summary.</li>
        <li><i><span class="grey-bolded">content: </span></i>Content to be displayed, the text of up to 4 pages of the document.</li>
        <li><i><span class="grey-bolded">report_type: </span></i>Type of report.</li>
        <li><i><span class="grey-bolded">locations: </span></i>Locations mentioned in the report.</li>
        <li><i><span class="grey-bolded">full_content: </span></i>Clean text of the pdf.</li>
        <li><i><span class="grey-bolded">markdown_text: </span></i>Markdown of the pdf text.</li>
        <li><i><span class="grey-bolded">document_theme: </span></i>Theme of the document.</li>
        <li><i><span class="grey-bolded">new_detected_disasters: </span></i>Disasters detected in the document.</li>
    </ul>
    <p><span class="bolded">pdf Metadata information: </span>  This information is extracted from the metadata of the pdf file. It is available in the metadata dictionary of the response (All are bool type).</p>
    <ul>
        <li><i><span class="grey-bolded">author: </span></i>Author of the pdf document.</li>
        <li><i><span class="grey-bolded">doc_created_date: </span></i>The date of the document creation.</li>
        <li><i><span class="grey-bolded">doc_modified_date: </span></i>The date of the document modification.</li>
        <li><i><span class="grey-bolded">num_of_pages: </span></i>Number of pages in the document.</li>
        <li><i><span class="grey-bolded">acharsPerPage: </span></i>Characters per page in the document.</li>
    </ul>
    <h3>Code example: </h3>
    <code>
       {document_code_snippet}
    </code>
    <br>
    <br>
    <h3 id="response_keys" class="anchor">The response keys are the following:</h3>
    <ul>
        <li><i><span class="grey-bolded">'metadata': </span></i>Returns a dictionary with metadata.</li>
        <li><i><span class="grey-bolded">'document_language': </span></i>Returns the language and the language score.</li>
        <li><i><span class="grey-bolded">'document_title': </span></i>List of title – Likelihood pairs</li>
        <li><i><span class="grey-bolded">'document_summary_parameters': </span></i>Dictionary with inputs to generate the summary.</li>
        <li><i><span class="grey-bolded">'content': </span></i>List of strings with the text of the first 4 pages of the document.</li>
        <li><i><span class="grey-bolded">'report_type': </span></i>string with the report-type.</li>
        <li><i><span class="grey-bolded">'locations': </span></i>Dictionary with locations and number of occurrences.</li>
        <li><i><span class="grey-bolded">'full_content': </span></i>Clean string with all the text of the document.</li>
        <li><i><span class="grey-bolded">'markdown_text': </span></i>String with the text of the document in markdown type.</li>
        <li><i><span class="grey-bolded">'document_theme': </span></i>Themes of the document in a list.</li>
        <li><i><span class="grey-bolded">'new_detected_disasters': </span></i>List of detected disasters in the document.</li>
    </ul>
    <h3 id="docu_summary_endpoint" class="anchor"><i>2. Document Summary Endpoint</i></h3>
    <p>
        <span class="bolded">URL: </span><a href="https://d4gumsi.pythonanywhere.com/api/v2/products/summary ">https://d4gumsi.pythonanywhere.com/api/v2/products/summary</a>
    </p>
    <p><span class="bolded">Method: </span> <u>POST</u></p>
    <p><span class="bolded">Description: </span>This endpoint generates a summary of the document based on the parameters received from the first API call and also extracts the keywords of the summary.</p>
    <p><span class="bolded">Payload Parameters: </span>The parameters obtained from the first API call (<u><i>document_summary_parameters </i></u>). Pass the exact dictionary that was generated in the first API response with the key <u><i>document_summary_parameters</i></u>.</p>
    <h3>Code example: </h3>
    <code>
       {summary_code_snippet}
    </code>
    <br>
    <br>
    <h2 id="workflow" class="anchor">Complete Workflow</h2>
    <ol>
        <li><span class="bolded">Prepare Payload and File</span></li>
        <ul>
            <li>Set the necessary payload parameters.</li>
            <li>Provide the PDF file path and name.</li>
        </ul>
        <br>
        <li><span class="bolded">Make the First API Call</span></li>
        <ul>
            <li>Send the PDF file and payload to the Document Processing Endpoint.</li>
            <li>Retrieve `document_summary_parameters` from the response.</li>
        </ul>
        <br>
        <li><span class="bolded">Conditionally Make the Second API Call</span></li>
        <ul>
            <li>If `document_summary` or `Return_ALL` is set to `True`, use the obtained parameters to request a document summary.</li>
        </ul>
        <br>
    </ol>
    <p><span class="bolded">¡Performance note!: </span>Due to server traffic, for better performance, try each API call 2 times. Follow the example below.</p>
    <h3 id="sample_code" class="anchor">Sample code: </h3>
    <code>
       {workflow_code_snippet}
    </code>
    <br>
    <br>
    <br>
  </div>
  
  <style>
    .simex-container {
      font-family: "Open Sans", sans-serif;
      margin: 1rem 12rem 2rem 12rem;
      background-color: var(--background-color-light);
    }

    h3 {
        font-weight: bolder;
        padding-top: 30px;
    }
    .grey-bolded {
        font-weight: bolder;
        color: grey;
    }

    .bolded {
        font-weight: bolder;
    }

    code {
        white-space: pre-line;
        color: #52595D	;
    }

    .anchor {margin-top: -100px; padding-top: 130px; }

    #docu_processing_endpoint {
        padding-top: 100px;
    }

  
    @media (max-device-width: 912px) and (min-resolution: 2dppx) {
      .simex-container {
        margin: 1rem 2rem 2rem 2rem;
      }
  
      h1 {
        font-size: 1.2rem;
      }
  
      h2 {
        font-size: 1.15rem;
      }
      h3 {
        font-size: 1.1rem;
      }
  
      p {
        font-size: 0.9rem;
      }
      
    
    }
  </style>
  