import os
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

error_logs = Path(__file__).parent / "error-logs.txt"


def get_cst_timestamp():
    is_dst = time.localtime().tm_isdst
    offset = -6 if not is_dst else -5
    central_tz = timezone(timedelta(hours=offset))
    now = datetime.now(central_tz)
    return now.strftime("%Y-%m-%d-%H-%M")


def create_error_log_file():
    try:
        if not os.path.isfile(error_logs):
            with open(error_logs, "w") as _:
                pass
    except Exception as e:
        print(f"create_error_log_file error: {e}")


def write_error_log_test(e):
    try:
        with open(error_logs, "a") as file:
            file.write(f"[{get_cst_timestamp()}]: Exception: {e}\n")
        print("write_error_log success.")
    except Exception as e:
        print(f"write_error_log_test error: {e}")


create_error_log_file()
