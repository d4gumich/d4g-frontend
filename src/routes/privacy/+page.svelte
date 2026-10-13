<script>
  import { base } from "$app/paths";
  import Navbar from "$lib/components/navbar.svelte";

  const currentPage = "privacy";
</script>

<svelte:head>
  <title>Privacy notice</title>
</svelte:head>

<Navbar {currentPage} />

<article class="notice">
  <h1>Privacy notice</h1>
  <p class="dated">12 October 2026</p>
  <p>
    This page describes what this website does with API keys, resumes, and the
    other text you type into Data4Good products. It follows the software as it
    works today. It is not a legal certificate, and it does not create an account.
  </p>

  <h2>Who we are</h2>
  <p>
    Data4Good is a project of the School of Information at the University of
    Michigan, 105 S. State Street, Ann Arbor, MI 48109-1285. Questions about
    this notice can go to
    <a href="mailto:info@data4good.center">info@data4good.center</a>.
  </p>

  <h2>API keys</h2>
  <p>
    You paste a provider key once. The page can take a Google Gemini, OpenAI,
    or Anthropic key. The browser sends that key to our API. The API keeps it
    in a server session. Any session field whose name contains “key” is
    encrypted before it is stored. The status check never sends the key back.
  </p>
  <p>
    If the server was started without a configured encryption secret, that
    encryption key exists only in the running process. Restarting the API
    drops every session, and you paste the key again. The key string itself
    does not tell us when Gemini, OpenAI, or Anthropic will revoke it. The
    time shown on the form is this site’s session deadline, not the provider’s.
  </p>
  <p>
    A personal session stays live for 30 minutes after it is last used, and it
    ends 12 hours after it starts even if you keep using it. Each successful
    visit slides the 30-minute clock and refreshes the browser cookie to match.
    The 12-hour deadline does not move. A team key for a Lighthouse Deep
    session lasts 59 minutes. That time is both the idle limit and the hard stop.
  </p>
  <p>
    The cookies are named <code>session_id</code> and <code>lighthouse_session</code>.
    They are HttpOnly, so page scripts cannot read them. They are marked Secure
    by default, SameSite=None, and Path=/. Logout clears both cookies and the
    server session. Logout does not require the extra request token.
  </p>
  <p>
    Unsafe requests also send a CSRF token. That token stays in the page’s
    memory. It is not written to localStorage, and it is not inside the
    encrypted session payload. Signing in is limited to 30 attempts in 10
    minutes for one address. When the API is behind a proxy, that address is
    the last hop in the forwarding header.
  </p>

  <h2>When a request fails</h2>
  <p>
    The page tells you what to try next and shows a short reference code.
    The same code is written in the API log. The log does not keep the API
    key. The browser console is not the record of the failure.
  </p>

  <h2>What the browser keeps</h2>
  <p>
    Lighthouse keeps the last 10 resumes in <code>sessionStorage</code> under
    <code>lighthouse_history</code>. That includes the extracted text, the
    result, and a tag for whether the analysis used your key or the team model.
    A seat token and the session dates you hold are also in
    <code>sessionStorage</code>. All of that is deleted when the tab closes.
  </p>
  <p>
    <code>lighthouse_session_expiry</code> in <code>localStorage</code> is only
    a clock for the on-screen timer. It is not your key and it is not your resume.
  </p>

  <h2>Lighthouse with your Gemini key</h2>
  <p>
    Uploading a PDF only parses it. Analysis starts when you press Run AI
    Analysis. The file has to begin with a PDF header and has to be 5 MB or
    smaller. Text sent for analysis is limited to 50,000 characters. If the
    file cannot be read, the response is a plain sentence. The parser’s own
    message is not returned, because that message can contain a piece of the document.
  </p>
  <p>
    The resume text is sent to Google Gemini with your key so the model can
    list skills. The server then embeds those skills on the API machine with
    BAAI/bge-base-en-v1.5. Only that vector is sent to the Qdrant collection
    <code>career_rag</code>, using the server’s Qdrant key. The query does not
    add your resume to the collection. Matching job text and the skill list
    are sent back to Gemini, again with your key, for the recommendations.
  </p>
  <p>
    One session can run 12 of these analyses in 10 minutes. The shared career
    index is the organization’s data. Your resume is not written into it.
  </p>

  <h2>Lighthouse Deep sessions</h2>
  <p>
    The public calendar does not ask for an email, and the API does not store one.
    A seat is an anonymous id, capped at 30 people, held in the API process.
    A restart drops the seats. An <code>.ics</code> file or a Google Calendar
    link is built in your browser so you can set your own reminder. We do not
    receive a copy of your calendar.
  </p>
  <p>
    During a live session, resume text is sent to the Hugging Face Space
    <code>Data4GoodCenter/resume_extraction_test</code>, which runs
    meta-llama/Meta-Llama-3.1-8B-Instruct. The server uses its own Hugging Face
    token for that call. The same 5 MB and 50,000-character caps apply. Wake,
    pause, stop, and the scheduled upload routes accept a team session or the
    team key. A seat token by itself cannot start or stop the GPU.
  </p>

  <h2>Hangul</h2>
  <p>
    Hangul can send uploaded document text to Gemini for metadata and for a
    summary. If you have a personal key in the session, that key is used. If
    you do not, the server uses its own Google key. A key typed into the
    Hangul form is removed and is not the key that gets used.
  </p>

  <h2>Owl</h2>
  <p>
    Your question is sent to Gemini, and it is also embedded with Gemini’s
    <code>models/gemini-embedding-001</code>. The key is your personal key, or
    the server’s Google key when you have no personal key or you switch to the
    team key. The embedding is compared with report vectors already in the
    project’s Postgres database. The question is not added to that report collection.
    The default answer model is gemini-1.5-flash.
  </p>

  <h2>Socrates</h2>
  <p>
    Socrates requires a personal session. A Lighthouse team session is not
    accepted. Your prompt is sent to the model selected for that session. If
    the server has a database configured, it keeps a conversation checkpoint
    so Resume can continue the thread. That thread is tied to the browser
    session, not to an account. If no database is configured, the thread lives
    only in the running process and disappears on restart. Errors shown in the
    browser and written to the log have the provider key removed.
  </p>

  <h2>Chetah</h2>
  <p>
    Chetah searches local result sets. It does not call a model. A request that
    includes an API key field is rejected.
  </p>

  <h2>What this site does not do</h2>
  <p>
    There is no account database of resumes, and the calendar does not collect
    an email address. The software has no path that sells the text or sends it
    to an advertiser. Text leaves the API only for the steps above: Google for
    Gemini calls, Hugging Face for a Deep-session analysis, Qdrant for a career
    query, and Postgres when Owl searches reports or Socrates is configured to
    keep a thread.
  </p>

  <h2>Children</h2>
  <p>
    This site is not directed at children. It does not ask for your age, and it
    does not create a separate child account.
  </p>

  <h2>Changes</h2>
  <p>
    If the handling above changes, this page changes with it. The date at the
    top is the date of this notice.
    <a href={`${base}/faq`}>FAQ</a>
  </p>
</article>

<style>
  .notice {
    max-width: 42rem;
    margin: 2.5rem auto 4rem;
    padding: 0 1.5rem;
    color: var(--text-color-main);
    font-family: "Open Sans", sans-serif;
    font-size: 1.05rem;
    line-height: 1.6;
  }

  h1 {
    margin: 0;
    font-family: "Work Sans", sans-serif;
    font-size: 2.4rem;
    font-weight: 500;
    text-decoration: underline;
    text-decoration-color: rgba(227, 184, 120, 1);
    text-decoration-thickness: 4px;
    text-underline-offset: 10px;
  }

  h2 {
    margin: 2rem 0 0.4rem;
    font-family: "Work Sans", sans-serif;
    font-size: 1.35rem;
    font-weight: 500;
  }

  .dated {
    margin: 0.8rem 0 1rem;
    color: var(--blue-color-main);
    font-weight: 600;
  }

  a {
    color: var(--blue-color-main);
  }

  code {
    font-size: 0.92em;
  }

  @media (max-width: 700px) {
    .notice {
      margin-top: 1.5rem;
      font-size: 1rem;
    }

    h1 {
      font-size: 2rem;
    }
  }
</style>
