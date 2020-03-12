import sys
from sense_hat import SenseHat
sense = SenseHat()

if len(sys.argv) > 1:
    message = sys.argv[1]
    sense.show_message(message)
    print(message)
