import sys

if len(sys.argv) > 1 and sys.argv[1] == 'hello':
    print('Hello to you too!')
else:
    print('Why you not say hello friend?')
sys.stdout.flush()
