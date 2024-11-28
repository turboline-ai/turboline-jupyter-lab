from setuptools import setup, find_packages
import os

setup(
    name='Turboline-AI',
    version='0.1.0',
    description='AI-powered code generator for Python Data Science and Data Engineering',
    author='Turboline-AI',
    author_email='dev@turboline.ai',
    url='https://github.com/turboline-ai/turboline-jupyter-lab',
    packages=find_packages(),
    install_requires=[
        'jupyter-server>=1.0.0',
        'openai',
        'python-dotenv',
    ],
    include_package_data=True,
    zip_safe=False,
    entry_points={
        'jupyter_server.extension': [
            'turboline_ai = turboline_ai'
        ]
    },
    cmdclass={
        'build_ext': build_ext,
    },
    classifiers=[
        'Framework :: Jupyter',
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
    ],
)
