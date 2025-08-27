#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import logging
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.endpoint import run

# Import our custom actions
from actions import (
    ActionLangchainRAG,
    ActionBookingHandler,
    ActionPricingHandler,
    ActionUrgentSupportHandler
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting Rasa Actions Server...")
    run()
