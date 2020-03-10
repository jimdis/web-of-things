from sense_hat import SenseHat
sense = SenseHat()

# Take readings from all three sensors
t = sense.get_temperature()
h = sense.get_humidity()
p = sense.get_pressure()

# Round the values to integers
t = round(t)
h = round(h)
p = round(p)

# Print the values
print(t)
print(h)
print(p)
