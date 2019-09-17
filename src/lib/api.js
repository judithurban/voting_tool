import axios from "axios";
import { possiblePollStates } from "./poll";

const url = "http://127.0.0.1:7999";

export let authToken = localStorage.getItem("authToken");

export async function fetchPolls() {
  const response = await axios.get(`${url}/polls`);
  return response.data;
}

export async function fetchPoll(pollId) {
  const response = await axios.get(`${url}/polls/${pollId}`);
  return response.data;
}

export async function savePoll(newPollObject, pollId) {
  // if there's no pollId, it's a post request
  if (!pollId) {
    const response = await axios.post(`${url}/polls`, newPollObject, {
      headers: {
        Authentication: authToken,
        ContentType: "application/json"
      },
      responseType: "json"
    });
    return response.data;
  }
  // if there is a pollId, it's a patch request
  const response = await axios.patch(`${url}/polls/${pollId}`, newPollObject, {
    headers: {
      Authentication: authToken,
      ContentType: "application/json"
    },
    responseType: "json"
  });
  return response.data;
}

export async function deletePoll(pollId) {
  const response = await axios.delete(`${url}/polls/${pollId}`, {
    headers: {
      Authentication: authToken,
      ContentType: "application/json"
    },
    responseType: "json"
  });
  console.log("DELETED", response.data);
  return response.data;
}

// export async function saveVote(pollId, newVoteObject) {

// }

export async function fetchVote(pollId, userId) {
  //! Authentication: Here we get the UserId by token
  //if there's no userId passed in, get it from the database with the token
  if (!userId) {
    const userByToken = await axios.get(`${url}/user`, {
      headers: {
        Authentication: authToken,
        ContentType: "application/json"
      },
      responseType: "json"
    });
    userId = userByToken.data._id;
  }
  //then GET request with userId
  const responseVote = await axios.get(
    `${url}/polls/${pollId}/votes/${userId}`,
    {
      headers: {
        Authentication: authToken,
        ContentType: "application/json"
      },
      responseType: "json"
    }
  );
  const vote = responseVote.data;
  return vote;
}

export async function fetchPollResults(pollId) {
  //! Authentication: Here we get the UserId by token
  const responseVote = await axios.get(`${url}/polls/${pollId}/votes`, {
    headers: {
      Authentication: authToken,
      ContentType: "application/json"
    },
    responseType: "json"
  });
  const vote = responseVote.data;
  return vote;
}

export async function saveVote(pollId, rankedOptions, userId, usersFirstVote) {
  // If it's the user's first vote, it's a post
  //! Authentication: usersFirstVote: enough for checking if post/patch?
  if (usersFirstVote) {
    const responseVote = await axios.post(
      `${url}/polls/${pollId}/votes`,
      rankedOptions,
      {
        headers: {
          Authentication: authToken,
          ContentType: "application/json"
        },
        responseType: "json"
      }
    );
    return responseVote.data;
  }
  const responseVote = await axios.patch(
    `${url}/polls/${pollId}/votes/${userId}`,
    { ranking: rankedOptions },
    {
      headers: {
        Authentication: authToken,
        ContentType: "application/json"
      },
      responseType: "json"
    }
  );
  return responseVote.data;
}

/// OPEN/CLOSE POLLS

export async function changePollStatus(pollId, status) {
  if (!possiblePollStates[status]) {
    throw new Error(
      "The status can only be one of these:",
      ...possiblePollStates.values()
    );
  }
  const response = await axios.patch(
    `${url}/polls/${pollId}`,
    { status: status },
    {
      headers: {
        Authentication: authToken,
        ContentType: "application/json"
      },
      responseType: "json"
    }
  );
  return response.data;
}

/// USER AUTHENTICATION

export async function login(credentials) {
  try {
    const response = await axios.post(`${url}/login`, credentials, {
      headers: {
        ContentType: "application/json"
      },
      responseType: "json"
    });
    localStorage.setItem("authToken", response.data.data);
    return response.data;
  } catch (error) {
    if (error.response.data) {
      return error.response.data;
    }
  }
}

export async function signup(credentials) {
  try {
    const response = await axios.post(`${url}/signup`, credentials, {
      headers: {
        ContentType: "application/json"
      },
      responseType: "json"
    });
    localStorage.setItem("authToken", response.data.data);

    return response.data;
  } catch (error) {
    if (error.response.data) {
      return error.response.data;
    }
    // if (error.response) {
    //   return error.response;
    // }
    else return error;
  }
}
