#!/bin/bash

# Ensure logs directory exists
mkdir -p logs

# Function to monitor specific log events
monitor_log_events() {
  local event_type=$1
  echo "Monitoring $event_type events in authentication log..."
  
  # Tail the log file and grep for specific event types
  tail -f logs/auth.log | grep --color=always "$event_type"
}

# Check if an event type is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <event_type>"
  echo "Available event types:"
  echo "  - LOGIN_SUCCESS"
  echo "  - LOGIN_FAILED"
  echo "  - TOKEN_GENERATED"
  echo "  - AUTH_ERROR"
  echo "  - REGISTRATION_SUCCESS"
  exit 1
fi

# Call the monitoring function with the provided event type
monitor_log_events "$1"
